<template>
<div class="inline">
  <strong @click="showSelector = !showSelector">{{ currentMonth }}</strong>
  <ul v-if="showSelector">
    <li
      v-for="(month, idx) in selectableMonths"
      :key="idx"
      @click="selectMonth(month)">
      {{ month }}
    </li>
  </ul></div>
</template>

<script>
module.exports = {
  name: 'MonthSelector',
  data: function () {
    return {
      showSelector: false,
      selectableMonths: [],
      currentMonthName: '',
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    }
  },
  methods: {
    selectMonth: function(month) {
      this.showSelector = false;
      this.currentMonthName = month;
      this.$emit('clicked', this.currentMonthName);
    }
  },
  created: function() {
      this.$emit('clicked', this.currentMonth);
      var year = this.currentYear;
      var months = [];
      // show this month and 9 month back
      months.push(this.currentMonth);
      for(var i = 1; i < 10; i += 1) {
        var mi = this.months.indexOf(this.currentMonth.split(' ')[0]) - i;
        var m = this.months[mi < 0 ? Math.abs(mi +12) : mi];
        var y = mi < 0 ? (year - 1) : year;
        months.push(m + ' \'' + y.toString().substr(2, 2));
      }
      this.selectableMonths = months;
  },
  computed: {
    currentYear: function() {
      return new Date().getFullYear();
    },
    currentMonth: function() {
      return this.currentMonthName === ''
        ? this.months[new Date().getMonth()] + ' \'' + this.currentYear.toString().substr(2, 2)
        : this.currentMonthName;
    }
  }
}
</script>

<style scoped>
.inline {
  display: inline-block;
  position: relative;
}
ul {
  text-align: left;
  list-style-type: none;
  position: absolute;
  z-index: 10;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  width: 170px;
  right: 0;
}
ul li:hover {
  background-color: #e5e5e5;
  cursor: pointer;
}
</style>
