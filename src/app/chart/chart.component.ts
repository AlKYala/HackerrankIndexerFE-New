import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Label, MultiDataSet} from "ng2-charts";
import {ChartType} from "chart.js";
import {Subscription} from "rxjs";
import {PLanguageService} from "../../shared/datamodels/PLanguage/service/PLanguageService";
import {switchMap} from "rxjs/operators";
import {Planguage} from "../../shared/datamodels/PLanguage/model/PLanguage";
import {AnalyticsService} from "../../shared/services/AnalyticsService";
import {UsageStatistics} from "../../shared/datamodels/Analytics/models/UsageStatistics";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, AfterViewInit {

  public doughnutChartLabels: Label[] = [];
  public doughnutChartData: MultiDataSet = [
    []
  ];
  public doughnutChartType: ChartType = 'doughnut';
  public loaded: boolean = false;
  private subscriptions: Subscription[] = [];
  private pLanguages: Planguage[] = [];

  constructor(private pLanguageService: PLanguageService,
              private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
  }

  private initData(): void {
    const subscription: Subscription = this.pLanguageService
      .findAll()
      .pipe(switchMap((pLanguage: Planguage[]) => {
        this.pLanguages = pLanguage;
        return this.analyticsService.getUsagePercentagesOfPLanguages();
      }))
      .subscribe((data: UsageStatistics) => {
        this.initUsagePercentages(data);
        this.loaded = true;
      });
  }

  private initUsagePercentages(statistics: UsageStatistics): void {
    for(let i = 0; i < statistics.planguages.length; i++) {
      this.doughnutChartLabels.push(statistics.planguages[i].language);
      this.doughnutChartData[0].push(statistics.numberSubmissions[i]);
    }
  }

  ngAfterViewInit(): void {
    this.initData();
  }
}
