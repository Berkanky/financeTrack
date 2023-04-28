<template>
  <div class="row indexPageCss">
    <div
      class="col-md-3 col-sm-3 col-12 bg-dark"
      :style="{'height':this.store.mobileActive ? `${this.store.newHeight}` + 'px' : this.$q.screen.height + 'px'}"
    >
    <q-card class="bg-dark q-mt-md" flat>
      <div class="text-right">
        <q-btn-dropdown
          color="white" flat icon="more_vert">
          <q-list class="bg-dark text-white">
            <q-item clickable v-close-popup v-on:click="goFullScreen">
              <q-item-section>
                <q-item-label>
                  <q-icon size="sm" :name="this.store.fullScreenActive ? 'fullscreen_exit' : 'fullscreen'"
                  :color="this.store.fullScreenActive ? 'red' : 'primary'" text-color="white"></q-icon>
                  {{this.store.fullScreenActive ? 'Full-Screen Exit' : 'Full-Screen'}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <q-card-section horizontal>
        <q-card class="col-6 bg-dark ">
          <q-card-section class="text-center">
            <q-btn
              icon="attach_money"
              label="Income" color="green" glossy v-on:click="openIncomeComponent" class="full-width full-height"></q-btn>
          </q-card-section>
        </q-card>
        <q-card class="bg-dark col-6">
          <q-card-section class="text-center">
            <q-btn
            icon="attach_money"
            label="Expense" color="red" v-on:click="openExpenseComponent" glossy class="full-width full-height"></q-btn>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
    <q-card class="bg-dark text-white" flat>
      <q-card-section class="text-center" style="width:60%;margin:0 auto;">
        <q-btn-dropdown
          color="primary" icon="currency_exchange" glossy split
          :label="this.store.baseCurrency.currency ? this.store.baseCurrency.currency : 'Base Currency'" class="full-width full-height">
          <q-list>
            <q-item clickable v-close-popup @click="selectCurrencyType(data)" v-for="(data,key) in this.store.currencyList" :key="key">
              <q-item-section>
                <q-item-label>{{data}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-section>
      <q-card-section class="text-center">
        <q-card class="bg-dark text-white text-capitalize" flat>
          <q-card-section class="row">
            <q-card class="bg-dark text-capitalize col-12 col-md-6 col-sm-6 text-center" dark bordered>
              <q-card-section horizontal>
                <div class="text-caption text-weight-bold text-grey-4 q-pa-md">
                  {{ this.totalIncomeReturn() }}
                </div>
              </q-card-section>
            </q-card>
            <q-card dark bordered class="bg-dark text-capitalize col-12 col-md-6 col-sm-6 text-center">
              <q-card-section horizontal>
                <div class="text-caption text-grey-4 text-weight-bold q-pa-md">
                  {{ this.totalExpenseReturn() }}
                </div>
              </q-card-section>
            </q-card>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
    </div>
    <div class="col-md-9 col-sm-9 col-12 bg-grey-3">
      <tracksAll />
    </div>
    <filterComponent v-if="this.store.filterActive"/>
    <expenseComponent v-if="this.store.expenseComponentActive"/>
    <incomeComponentVue v-if="this.store.incomeComponentActive"/>
    <updateComponent v-if="this.store.updateActive"/>
  </div>
</template>

<script>
import filterComponent from 'src/components/filterComponent.vue';
import updateComponent from 'src/components/updateComponent.vue';
import tracksAll from 'src/components/tracksAll.vue';
import expenseComponent from 'src/components/expenseComponent.vue';
import incomeComponentVue from '../components/incomeComponent.vue'
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    incomeComponentVue,
    expenseComponent,
    tracksAll,
    updateComponent,
    filterComponent
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{

    }
  },
  methods:{
    goFullScreen(){
      if(!this.store.fullScreenActive){
        this.$q.fullscreen.request()
        .then(() => {
          // success
          this.store.fullScreenActive = true
        })
        .catch(err => {
          //
        })
      }else{
        // Exiting fullscreen mode:
        this.$q.fullscreen.exit()
          .then(() => {
            // success
            this.store.fullScreenActive = false
          })
          .catch(err => {
            //
          })
      }
    },
    totalExpenseReturn(){
      if(this.store.totalTracks.expenses.length){
        const info = this.store.totalTracks.expenses[0].amount
        const formatInfo = info.toFixed(3)
        const message = 'Total Expenses' + ' ' + ' : ' + ' ' + formatInfo
        return message
      }else{
        const message = 'Total Expenses' + '  ' + 0
        return message
      }
    },
    totalIncomeReturn(){
      if(this.store.totalTracks.incomes.length){
        const info = this.store.totalTracks.incomes[0].amount
        const formatInfo = info.toFixed(3)
        const message = 'Total Incomes' + ' ' + ' : ' + ' ' + formatInfo
        return message
      }else{
        const message = 'Total Incomes ' + ' : ' + 0
        return message
      }
    },
    async exchangeCurrency(element){
      const q = Number(element.amount)
      console.log('q',q)
      const url = `https://currency-exchange.p.rapidapi.com/exchange?from=${element.currency}&to=${this.store.baseCurrency.currency}&q=1`;
      const options = {
        method: 'GET',
        headers: {
          'content-type': 'application/octet-stream',
          'X-RapidAPI-Key': 'e2880f91d9mshfb17a8e0244a72ep13079cjsn4b92a900ff35',
          'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        let result = await response.json();
        result = result * element.amount
        console.log('exchangeREsult',element.currency,'to',this.store.baseCurrency.currency,result)
        if(element.type === 'Income'){
          const secondResult = this.store.totalTracks.incomes.find(object => object.currency === this.store.baseCurrency.currency)
          if(!secondResult){
            const newData = {
              currency:this.store.baseCurrency.currency,
              amount:result,
              type:element.type
            }
            this.store.totalTracks.incomes.push(newData)
          }else{
            secondResult.amount += Number(result)
          }
        }else{
          const thirdResult = this.store.totalTracks.expenses.find(object => object.currency === this.store.baseCurrency.currency)
          if(!thirdResult){
            const newDataSecond = {
              currency:this.store.baseCurrency.currency,
              amount:result,
              type:element.type
            }
            this.store.totalTracks.expenses.push(newDataSecond)
          }else{
            thirdResult.amount += Number(result)
          }
        }
        console.log('TotalTrack',this.store.totalTracks)
      } catch (error) {
        console.error(error);
      }
    },
    converToBaseCurrency(uniqueList){
      if(this.store.baseCurrency.currency){
        this.store.totalTracks.incomes = []
        this.store.totalTracks.expenses = []
        console.log(uniqueList)
        uniqueList.forEach(element => {
          console.log(element)
          this.exchangeCurrency(element)
        });
      }
    },
    getUniqueCurrencies(){
      if(this.store.allTracks.length){
        const uniqueList = []
        this.store.allTracks.forEach(element => {
          const result = uniqueList.find(object => object.currency === element.currency && object.type === element.type)
          if(!result){
            const currencyData = {
              currency:`${element.currency}`,
              amount:Number(element.amount),
              type:element.type
            }
            uniqueList.push(currencyData)
          }else{
            result.amount += Number(element.amount)
          }
        });
        console.log('uniqueList',uniqueList)
        this.converToBaseCurrency(uniqueList)
      }
    },
    selectCurrencyType(data){
      this.store.baseCurrency.currency = data
      console.log('BaseCurrency',this.store.baseCurrency.currency)
      this.getUniqueCurrencies()
    },
    openIncomeComponent(){
      this.store.incomeComponentActive = true
    },
    openExpenseComponent(){
      this.store.expenseComponentActive = true
    }
  },
  created(){
    this.store.getCurrencyList()
    //this.getUniqueCurrencies()
  },
  watch:{
    'store.allTracks':{
      handler(newValue,oldValue){
        if(newValue.length){
         this.getUniqueCurrencies()
        }
      },
    }
  }
}
</script>

<style scoped>
.indexPageCss{
}
</style>
