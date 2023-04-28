import { defineStore } from 'pinia';
export const useCounterStore = defineStore('counter', {
  state: () => ({
    window:{},
    mobileActive:false,
    newHeight:'',

    //ıncome component
    incomeComponentActive:false,

    //expense Component
    expenseComponentActive:false,

    //allTracks
    allTracks:[],
    pureListTracks:[],
    //currencyList
    currencyList:[],
    //updateActive
    updateActive:false,
    updateData:{},

    //baseCurrency
    baseCurrency:{
      currency:'EUR'
    },

    //totalIncome
    totalTracks:{
      incomes:[],
      expenses:[]
    },
    filterActive:false,
    filterResultActive:false,
    filterData:{},

    //fullScreenActive
    fullScreenActive:false,

    //rapidAPiKey
    rapidApiKey: 'e2880f91d9mshfb17a8e0244a72ep13079cjsn4b92a900ff35',
  }),
  getters: {
  },
  actions: {
    globalSetDate(){
      const date = new Date();
      const dateString = date.toString();
      return dateString
    },
    async getCurrencyList(){
      const url = 'https://currency-exchange.p.rapidapi.com/listquotes';
      const options = {
        method: 'GET',
        headers: {
          'content-type': 'application/octet-stream',
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        this.currencyList = result
        console.log(this.currencyList)
      } catch (error) {
        console.error(error);
      }
    },
  },
});
