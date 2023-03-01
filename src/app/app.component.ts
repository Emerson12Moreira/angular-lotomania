import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  userbet = '';
  randarr = [];
  custombet = [];
  tmp;
  pq = 0;
  sq = 0;
  tq = 0;
  qq = 0;
  total = 0;
  qds = [[], [], [], []];
  indexes = [[], [], [], []];
  result = [];
  totalCompared = 0;
  hits = [];
  userresult = '';
  attempts = 0;
  /* quads = [
    [
      1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 31, 32, 33, 34, 35,
      41, 42, 43, 44, 45,
    ],
    [
      6, 7, 8, 9, 10, 16, 17, 18, 19, 20, 26, 27, 28, 29, 30, 36, 37, 38, 39,
      40, 46, 47, 48, 49, 50,
    ],
    [
      51, 52, 53, 54, 55, 61, 62, 63, 64, 65, 71, 72, 73, 74, 75, 81, 82, 83,
      84, 85, 91, 92, 93, 94, 95,
    ],
    [
      56, 57, 58, 59, 60, 66, 67, 68, 69, 70, 76, 77, 78, 79, 80, 86, 87, 88,
      89, 90, 96, 97, 98, 99, 0,
    ],
  ]; */
  quads = [
    [
      1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25
    ],
    [
      26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50
    ],
    [
      51, 52, 53, 54, 55, 56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75
    ],
    [
      76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,0
    ],
  ];
  res = [];
  userChoices = [];
  mirrorBet = false;
  constructor() {}

  generatenewbet() {
    this.res = [];
    this.qds = [[], [], [], []];
    this.custombet = [];
    for (let ind = 0; ind < 4; ind++) {
      this.randarr = [];
      for (let i = 0; i < 12; i++) {
        const n = Math.floor(Math.random() * 25) + 0;
        if (this.checkifmark(n, this.randarr)) {
          i--;
        } else {
          this.randarr.push(n);
          console.log(this.randarr);
        }
      }
      for (let i = 0; i < 12; i++) {
        this.custombet.push(this.quads[ind][this.randarr[i]]);
      }
    }
    this.res = this.order(this.custombet);
    this.update();
  }

  clear() {
    this.res = [];
    this.qds = [[], [], [], []];
    this.update();
  }

  complete() {
    this.indexes = [[], [], [], []];
    let tmparr = [];
    let tmpAvg = 0;
    for (let i = 0; i < this.qds.length; i++) {
      for (let j = 0; j < this.qds[i].length; j++) {
        let v = this.qds[i][j];
        let pos = this.quads[i].indexOf(v);
        this.indexes[i].push(pos);
        console.log('this.indexes');
        tmparr.push(v);
      }
    }
    this.qds = [[], [], [], []];
    let pos = [];
    for (let i = 0; i < 100; i++) {
      if (!this.checkifmark(i, tmparr)) {
        pos.push(i);
      }
    }
    let num = 50 - this.res.length;
    for (let i = 0; i < num; i++) {
      const n = Math.floor(Math.random() * pos.length) + 0;
      if (this.checkifmark(pos[n], this.res)) {
        i--;
      } else {
        this.res.push(pos[n]);
      }
    }
    this.update();

    //remove this to a more simpler version
    if (this.result) {
      for (let i = 0; i < this.result.length; i++) {
        if (this.checkifmark(this.result[i], this.res)) {
          tmpAvg++;
        }
      }
      if (tmpAvg > 4) {
        // this.clear();
        //  this.complete();
      }
    }
    //
  }

  mirror() {
    this.mirrorBet = !this.mirrorBet;
    if (this.res.length === 50) {
      this.indexes = [[], [], [], []];
      let tmparr = [];
      for (let i = 0; i < this.qds.length; i++) {
        for (let j = 0; j < this.qds[i].length; j++) {
          let v = this.qds[i][j];
          let pos = this.quads[i].indexOf(v);
          this.indexes[i].push(pos);
          tmparr.push(v);
        }
      }
      this.qds = [[], [], [], []];
      let pos = [];
      for (let i = 0; i < 100; i++) {
        if (!this.checkifmark(i, tmparr)) {
          pos.push(i);
        }
      }
      this.res = pos;
      this.update();
    }
  }

  update() {
    this.total = 0;
    this.quads.forEach((quad, index) => {
      quad.forEach((n, i) => {
        if (this.checkifmark(n, this.res)) {
          this.qds[index].push(n);
        }
      });
      this.total += this.qds[index].length;
    });
    this.pq = this.qds[0].length;
    this.sq = this.qds[1].length;
    this.tq = this.qds[2].length;
    this.qq = this.qds[3].length;
    for (let i = 0; i < this.res.length; i++) {
      if (isNaN(this.res[i])) {
        this.res.splice(i, 1);
        --i;
      }
    }
    this.res = this.res.filter((el, i, a) => i === a.indexOf(el));
    this.userbet = this.order(this.res)
      .toString()
      .toString()
      .replace(/,/g, '-');
    this.updateRes();
  }

  addRemoveNumber(n: number) {
    this.qds = [[], [], [], []];
    this.custombet = [];
    if (!this.checkifmark(n, this.res)) {
      if (this.res.length < 50) {
        this.res.push(n);
      }
    } else {
      this.res.splice(this.res.indexOf(n), 1);
    }
    this.update();
  }

  order(nums: Array<number>) {
    return nums.sort((a, b) => a - b);
  }

  checkifmark(val: number, arr: Array<number>) {
    const mark = arr.indexOf(val);
    return mark > -1 ? true : false;
  }

  newbet() {
    const simulate = this.userbet
      .replace(/ /g, '-')
      .replace(/\t/g, '-')
      .replace(/\n/g, '-')
      .replace(/,/g, '-');
    let tmpSimulate = simulate.split('-').map((item) => parseInt(item, 10));
    tmpSimulate = tmpSimulate.filter((el, i, a) => i === a.indexOf(el));
    if (!(tmpSimulate.length > 50)) {
      this.qds = [[], [], [], []];
      this.tmp = this.userbet
        .replace(/ /g, '-')
        .replace(/\t/g, '-')
        .replace(/\n/g, '-')
        .replace(/,/g, '-');
      this.res = this.tmp.split('-').map((item) => parseInt(item, 10));
      this.update();
    }
  }

  updateRes() {
    this.hits = [];
    let tmp = this.userresult
      .replace(/ /g, '-')
      .replace(/\t/g, '-')
      .replace(/\n/g, '-')
      .replace(/,/g, '-');
    this.result = tmp.split('-').map((item) => parseInt(item, 10));
    this.userresult = tmp;
    this.totalCompared = 0;
    this.res.forEach((v, i) => {
      if (this.checkifmark(v, this.result)) {
        this.hits.push(v);
        this.totalCompared++;
      }
    });
  }

  simulate() {
    if (this.result.length === 20) {
      let maxhits = 0;
      this.attempts = 0;
      while (maxhits < 17 || this.attempts < 500) {
        this.clear();
        this.res = [];
        this.complete();
        this.attempts++;
        maxhits = this.totalCompared;
      }
    }
  }

  addChoice() {
    if (this.userbet.split('-').length === 50) {
      this.userChoices.push(this.userbet);
    }
  }

  removeChoice(i) {
    this.userChoices.splice(i, 1);
  }
}
