import { Component, OnInit, OnDestroy } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';

//import { Chart, registerables } from 'chart.js';
/*

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {
  selectedPeriod: string = 'day'; // Mặc định chọn "Ngày"
  private chart: Chart | null = null;
  last10Days: string[] = [];
  private totals_day: number[] = [];// Lưu tổng hóa đơn theo ngày
  private totals_months: number[] = [];// Lưu tổng hóa đơn theo tháng
  private totals_years: number[] = [];// Lưu tổng hóa đơn theo năm
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Register các chart.js components cần thiết
    Chart.register(...registerables);
    this.last10Days = this.getLast10Days();
    // Khởi tạo biểu đồ cột với dữ liệu mặc định cho ngày
    this.updateChartData();
  }

  ngOnDestroy(): void {
    // Hủy bỏ biểu đồ khi component bị hủy
    if (this.chart) {
      this.chart.destroy();
    }
  }

  // Hàm xử lý sự kiện thay đổi chọn lựa của select
  onSelectChange(event: any): void {
    this.selectedPeriod = event.target.value;
    this.updateChartData();
  }

  // Cập nhật dữ liệu cho biểu đồ khi người dùng thay đổi lựa chọn
  private updateChartData(): void {
    let labels: string[];
    let data: number[];

    if (this.selectedPeriod === 'day') {
      labels = this.getLast10Days();
      data = this.getFixedData('day');
    } else if (this.selectedPeriod === 'month') {
      labels = this.getLast10Months();
      data = this.getFixedData('month');
    } else {
      labels = this.getLast5Years();
      data = this.getFixedData('year');
    }

    const colors = this.getColors(labels.length); // Lấy màu sắc cho từng cột

    // Nếu biểu đồ đã tồn tại, hủy bỏ trước khi tạo lại
    if (this.chart) {
      this.chart.destroy();
    }

    // Khởi tạo hoặc cập nhật biểu đồ cột
    this.chart = new Chart('myBarChart', {
      type: 'bar', // Loại biểu đồ là cột
      data: {
        labels: labels,
        datasets: [{
          label: 'Số lượng',
          data: data,
          backgroundColor: colors,
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Hàm lấy 10 ngày gần nhất
  private getLast10Days(): string[] {
    const labels: string[] = [];
    const today = new Date();
    for (let i = 9; i >= 0; i--) {
      const date = new Date(today);

      date.setDate(today.getDate() - i);
      labels.push(date.toLocaleDateString('vi-VN'));
      const formattedDate = date.toISOString().split('T')[0];
      this.getInvoiceTotals('day', [formattedDate]);

    }
    return labels;
  }

  // Hàm lấy 10 tháng gần nhất
  private getLast10Months(): string[] {
    const labels: string[] = [];
    const today = new Date();
    for (let i = 9; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      labels.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }));
      console.log(date.getMonth() + 1, date.getFullYear());

    }
    return labels;
  }

  // Hàm lấy 5 năm gần nhất
  private getLast5Years(): string[] {
    const labels: string[] = [];
    const today = new Date();
    for (let i = 2; i >= 0; i--) {
      const date = new Date(today);
      date.setFullYear(today.getFullYear() - i);
      labels.push(date.getFullYear().toString());
    }
    return labels;
  }

  // Hàm lấy tổng hóa đơn từ API cho các ngày, tháng, hoặc năm
  private getInvoiceTotals(period: string, labels: string[]): void {
    console.log("labels", labels);

    const date = labels;
    this.http.get(`http://localhost:9000/api/invoices/total-by-date?date=${date}`)
      .subscribe(
        response => {
          this.totals_day.push(Number(response));  // Ép kiểu về số  // Thêm số vào mảng totals_day
          // console.log(this.totals_day); // In ra kết quả từ API
        },
        error => {
          console.error('Có lỗi xảy ra khi gọi API', error);
        }
      );
  }
  private getTotalAmountByMonth(month: number, year: number): void {
    this.http.get<number>(`http://localhost:9000/api/invoices/total-by-month?month=${month}&year=${year}`)
      .subscribe(
        (response) => {
          this.totals_months.push(Number(response));
        },
        (error) => {
          console.error('There was an error!', error);
        }
      );
  }

  // Hàm trả về dữ liệu cố định cho ngày, tháng, hoặc năm
  private getFixedData(period: string): number[] {
    if (period === 'day') {
      // return [65, 59, 80, 81, 56, 55, 40, 60, 70, 75]; // Dữ liệu cho 10 ngày
      return this.totals_day;
    } else if (period === 'month') {
      return [50, 45, 60, 75, 80, 95, 40, 70, 85, 100]; // Dữ liệu cho 10 tháng
    } else {
      return [200, 180, 150]; // Dữ liệu cho 5 năm
    }
  }

  // Hàm trả về danh sách các màu sắc cho từng cột
  private getColors(count: number): string[] {
    const colors: string[] = [];
    const colorPalette = [
      'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)',
      'rgba(255, 99, 71, 0.2)', 'rgba(0, 255, 255, 0.2)', 'rgba(255, 215, 0, 0.2)', 'rgba(102, 205, 170, 0.2)'
    ];

    for (let i = 0; i < count; i++) {
      colors.push(colorPalette[i % colorPalette.length]); // Lặp lại màu nếu số cột > số màu có sẵn
    }
    return colors;
  }
}
*/
