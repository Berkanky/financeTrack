<template>
  <q-dialog
    v-if="this.store.filterActive" v-model="this.store.filterActive"
    :maximized="this.store.mobileActive ? true : false"
    persistent
    dark
    :full-height="this.store.mobileActive ? true : false"
  >
  <q-card

    style="border-radius:7px;"
    :style="{'width':this.store.mobileActive ? '100%' : '450px'}"
    class="bg-dark text-white text-capitalize"
  >
    <q-card-section class="text-left">
      <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
    </q-card-section>
    <q-card-section horizontal>
      <q-card-section class="col-6 col-md-6 col-sm-6">
        <q-select v-model="this.store.filterData.type" dark :options="this.options" label="Select Track Type" color="white" standout="bg-dark text-white">
          <template v-slot:prepend>
            <q-icon name="info" color="white"></q-icon>
          </template>
        </q-select>
      </q-card-section>
      <q-card-section class="col-6 col-md-6 col-sm-6">
        <q-select
          v-model="this.store.filterData.currency" dark :options="this.store.currencyList"
          standout="bg-dark text-white"
          label="Select Track Type" color="white" @update:model-value="selectFilterCurrency">
          <template v-slot:prepend>
            <q-icon name="info" color="white"></q-icon>
          </template>
        </q-select>
      </q-card-section>
    </q-card-section>
    <q-card-section class="text-center">
      <q-input dark color="white" label="Enter Name Expense Or Income" v-model="this.store.filterData.detail" v-on:keyup="this.filterTrackDetail()">
        <template v-slot:prepend>
          <q-icon name="info"></q-icon>
        </template>
        <template v-slot:append v-if="this.store.filterData.detail">
          <q-btn icon="remove" color="dark" size="sm" v-on:click="this.store.filterData.detail = ''"></q-btn>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section class="text-right">
      <q-btn icon="clear_all" v-if="this.store.filterData.type || this.store.filterData.currency || this.store.filterData.detail" flat color="red" v-on:click="clearAllFilter"></q-btn>
      <q-btn
        icon="filter_list" flat color="green"
        v-if="this.store.filterData.type || this.store.filterData.currency && !this.checkSearchInputActiveOrNot()" v-on:click="confirmFilter"></q-btn>
      <q-btn icon="filter_list" flat color="green" v-if="this.checkSearchInputActiveOrNot()" v-on:click="showSearchFilterResult"></q-btn>
    </q-card-section>
  </q-card>
  </q-dialog>
</template>

<script>
import { useCounterStore } from 'src/stores/store';
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      options:['Income','Expense'],
      filterData:{}
    }
  },
  methods:{
    showSearchFilterResult(){
      this.store.filterResultActive = true
      this.store.filterActive = false
    },
    checkSearchInputActiveOrNot(){
      if(this.store.filterData.detail){
        return true
      }else{
        return false
      }
    },
    filterTrackDetail() {
      const filterValue = this.store.filterData.detail;
      if (filterValue) {
        this.store.allTracks = this.store.pureListTracks.filter(
          (object) =>(object.detail.toLowerCase()).startsWith(filterValue.toLowerCase())
        );
        if (!this.store.allTracks.length) {
          this.$q.notify({
            type: "negative",
            position: "bottom",
            timeout: 700,
            message: `${filterValue} Bulunamadı !`,
            icon: "info",
          });
        }
      } else {
        this.store.allTracks = this.store.pureListTracks;
      }
    },
    selectFilterCurrency(val) {
      const filterValue = val;
      if (filterValue) {
        this.store.allTracks = this.store.pureListTracks.filter(
          (object) => object.currency === filterValue
        );
        if (!this.store.allTracks.length) {
          this.$q.notify({
            type: "negative",
            message: "Filtreleme Başarısız !",
            icon: "info",
            timeout: 700,
            position: "top",
          });
          this.store.filterData.currency = "";
          this.store.allTracks = this.store.pureListTracks
        }
      } else {
        this.store.allTracks = this.store.pureListTracks;
      }
    },
    confirmFilter() {
      const typeFilter = this.store.filterData.type;
      const currencyFilter = this.store.filterData.currency;
      const detailFilter = this.store.filterData.detail;

      this.store.allTracks = this.store.pureListTracks
        .filter((object) => !typeFilter || object.type === typeFilter)
        .filter((object) => !currencyFilter || object.currency === currencyFilter)
        .filter((object) => !detailFilter || object.detail.startsWith(detailFilter));

      if (this.store.allTracks.length === 0) {
        this.$q.notify({
          type: 'negative',
          message: 'Filtreleme Başarısız !',
          icon: 'info',
          timeout: 700,
          position: 'top'
        });
        this.clearAllFilter();
        return;
      }

      console.log('filterResult', this.store.allTracks);
      this.store.filterResultActive = true;
      this.store.filterActive = false;
    },
    clearAllFilter(){
      this.store.filterData = {}
      this.store.allTracks = this.store.pureListTracks
    },
    goBack(){
      this.store.filterActive = false
    }
  },
  created(){

  },
  watch:{

  }
}
</script>

<style>
</style>
