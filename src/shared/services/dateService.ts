import { Injectable } from '@angular/core';

import { DiffDateBean } from '../../beans/diff-date-bean';


@Injectable()
export class DateService {

    /* constructor  */
    constructor(){

    }

    convertIsoToDate(isostr: string): Date {
        if (!isostr)
            return new Date(0);
        var parts = isostr.match(/\d+/g);
        var convertedDate = new Date();
        convertedDate.setFullYear(+parts[0]);
        convertedDate.setMonth(+parts[1] - 1);
        convertedDate.setDate(+parts[2]);
        convertedDate.setHours(+parts[3]);
        convertedDate.setMinutes(+parts[4]);
        convertedDate.setSeconds(+parts[5]);
        return convertedDate;
    }

    getdiffDate(firstDate, secondDate): DiffDateBean {
        var diffDate = new DiffDateBean();
        var tmp = secondDate.getTime() - firstDate.getTime();
        tmp = Math.round(tmp / 1000);
        tmp = Math.round((tmp - (tmp % 60)) / 60);
        diffDate.min = tmp % 60;
        tmp = Math.floor((tmp - diffDate.min) / 60);
        diffDate.hour = tmp % 24;
        tmp = Math.floor((tmp - diffDate.hour) / 24);
        diffDate.day = tmp;
        return diffDate;
    }

    convertPublishDate(publishDate: Date): string {
        var currentDate = new Date();
        var months = new Array("janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre");
        let newDatePulish = publishDate.getDate() + " " + months[publishDate.getMonth()];
        if (currentDate.getFullYear() != publishDate.getFullYear())
            newDatePulish += ", " + publishDate.getFullYear();
        return newDatePulish;
    }




}
