import { Component, Input, OnChanges, OnInit, SimpleChanges, HostBinding, QueryList, ViewChildren } from '@angular/core';
import { IntercomService, IMessage } from '../../../core/services/intercom.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { MatMenuTrigger } from '@angular/material';




interface FlatNode {
    expandable: boolean;
    name: string;
    level: number;
}
@Component({
    selector: 'dashboard-version-history',
    templateUrl: './dashboard-version-history.component.html',
    styleUrls: ['./dashboard-version-history.component.scss'],

})
export class DashboardVersionHistoryComponent implements OnInit, OnChanges {

    @HostBinding('class') classAttribute: string = 'dashboard-version-history';

    @Input() payload = {};

    @ViewChildren('versionHistoryItemMoreMenuTrigger', {read: MatMenuTrigger}) versionItemMoreMenuTriggers: QueryList<MatMenuTrigger>;

    constructor(private interCom: IntercomService) { }

    history = { dates: [], data: {} };
    defaultHistoryId: any;
    defaultHistoryDate: any;
    error: any = null;
    private subscription: Subscription = new Subscription();

    ngOnInit() {
        this.subscription.add(this.interCom.responseGet().subscribe((message: IMessage) => {
            switch (message.action) {
                case 'RefreshDashboardHistory':
                    this.loadHistory();
                    break;
                case 'SetDashboardHistory':
                    console.log("%cSetDashboardHistory", 'background: black; color: white; padding: 4px;', message);
                    if (message.payload.error) {
                        this.error = message.payload.error;
                    } else {
                        this.error = null;
                        const res = message.payload.data.histories;
                        const userNames = message.payload.data.userNames;
                        let defaultHistoryId = message.payload.data.defaultHistoryId;
                        const data = {};
                        for (let i = 0; i < res.length; i++) {
                            const dt = moment.unix(res[i].createdTime / 1000).format('YYYY-MM-DD'); // moment.unix(time).format(dtFormat) : moment.unix(time).utc().format(dtFormat), 'time:raw': time };

                            if (!data[dt]) {
                                data[dt] = [];
                            };

                            const userId = res[i].creatorId;

                            if (res[i].id === defaultHistoryId) {
                                this.defaultHistoryDate = dt;
                            }

                            data[dt].push({
                                id: res[i].id,
                                time: res[i].createdTime / 1000,
                                userId: res[i].creatorId.substr(5),
                                userName: userNames[userId]
                                // leave formatting to template
                                //time: moment.unix(res[i].createdTime / 1000).format('hh:mm a'),
                                //user: res[i].creatorId.substr(5) + ' (' + userNames[userId] + ')'
                            });
                        }

                        this.history = { dates: Object.keys(data), data: data };
                        this.defaultHistoryId = defaultHistoryId;
                    }
                    break;
            }
        }));
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log("changes=>", changes);
        if (changes.payload && changes.payload.currentValue) {
            this.loadHistory();
        }
    }

    loadHistory() {
        this.interCom.requestSend(<IMessage>{
            action: 'GetDashboardHistory'
        });
        // this.id = null;
    }

    loadVersion(id) {
        this.interCom.requestSend(<IMessage>{
            action: 'LoadDashboardVersion',
            id: id
        });
    }

    setDefaultVersion(id) {
        this.interCom.requestSend(<IMessage>{
            action: 'SetDashboardDefaultVersion',
            id: id
        });
    }

    // utility to find clipboard item more menu trigger
    private findVersionHistoryItemMoreTrigger(id: any): MatMenuTrigger {
        const trigger = this.versionItemMoreMenuTriggers.find(item => {
            console.log('item', item);
            return item.menuData.item.id === id;
        });
        return  trigger || null;
    }

    toggleVersionItemMoreMenu(history: any) {
        // find the specific trigger so we know where to originate menu
        const mTrigger: MatMenuTrigger = <MatMenuTrigger>this.findVersionHistoryItemMoreTrigger(history.id);

        if (mTrigger) {
            if (!mTrigger.menuOpen) {
                mTrigger.openMenu();
            } else {
                mTrigger.closeMenu();
            }
        } else {
            console.error('CANT FIND TRIGGER');
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
