<template>
  <div>
    <div v-if="entries.length === 0">
      <p class="text-center text-loading-response">
        No registrations found for the selected date
      </p>
    </div>
    <div v-else v-for="(entry, idx) in entries" :key="idx" class="entry">
      <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h2 class="display-4">{{ entry.name }}</h2>
        <p class="lead">{{ entry.note }}</p>
      </div>
      <div class="card-deck mb-3 text-center">
        <div class="card mb-4 shadow-sm">
          <div class="card-header">
            <h4 class="font-weight-normal">Hours</h4>
          </div>
          <div class="card-body">
            <h1 class="card-title font-weight-bold">{{ entry.total.h }}</h1>
          </div>
        </div>
        <div class="card mb-4 shadow-sm">
          <div class="card-header">
            <h4 class="font-weight-normal">Minutes</h4>
          </div>
          <div class="card-body">
            <h1 class="card-title font-weight-bold">{{ entry.total.m }}</h1>
          </div>
        </div>
        <div class="card mb-4 shadow-sm">
          <div class="card-header">
            <h4 class="font-weight-normal">Seconds</h4>
          </div>
          <div class="card-body">
            <h1 class="card-title font-weight-bold">{{ entry.total.s }}</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    'entries': Array
  },
  name: 'EntryList'
}
</script>

<style scoped>
h2 {
  font-size: 2.5rem;
}
.font-weight-normal {
  font-weight: 400
}
.font-weight-bold {
  font-weight: 500
}
</style>
