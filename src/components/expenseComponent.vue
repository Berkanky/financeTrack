<template>
  <q-dialog
    v-if="this.store.expenseComponentActive" v-model="this.store.expenseComponentActive"
    :maximized="this.store.mobileActive ? true : false"
    :full-height="this.store.mobileActive ? true : false"
    persistent
    dark
  >
    <q-card
      style="border-radius:7px;"
      :style="{'width':this.store.mobileActive ? '100%' : '450px','height':this.store.mobileActive ? '100%' : '600px'}"
      class="bg-dark text-white text-capitalize">
        <q-card-section class="text-left">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goback"></q-btn>
        </q-card-section>
        <q-card-section class="text-center">
          <div class="text-h6">
            Expense
          </div>
        </q-card-section>
        <q-card-section>
        <q-input
          standout="bg-primary text-white" dark  label="Enter Amount" type="number" v-model="this.expenseData.amount">
          <template v-slot:prepend>
            <q-icon name="pin" color="white"></q-icon>
          </template>
          <template v-slot:append v-if="this.expenseData.amount">
            <q-btn icon="remove" color="white" text-color="dark" round size="sm" v-on:click="this.expenseData.amount = ''"></q-btn>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="text-center">
        <q-btn-dropdown color="primary" :label="this.expenseData.selectedCurrency ? this.expenseData.selectedCurrency : 'Currency Type'">
          <q-list>
            <q-item clickable v-close-popup @click="selectCurrencyType(data)" v-for="(data,key) in this.store.currencyList" :key="key">
              <q-item-section>
                <q-item-label>{{data}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-section>
      <q-card-section>
        <q-input
          standout="bg-primary text-white" dark  label="Enter Detail" v-model="this.expenseData.detail">
          <template v-slot:prepend>
            <q-icon name="info" color="white"></q-icon>
          </template>
          <template v-slot:append v-if="this.expenseData.detail">
            <q-btn icon="remove" color="white" text-color="dark" round size="sm" v-on:click="this.expenseData.detail = ''"></q-btn>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="text-right">
        <q-btn icon="clear_all" color="red" v-on:click="clearAll"></q-btn>
        <q-btn icon="check" color="primary" class="q-ma-xs" v-on:Click="submitExpense"></q-btn>
      </q-card-section>
      </q-card>
  </q-dialog>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import {db} from '../firebase/index'
import { getDatabase, ref, set } from "firebase/database";
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
      expenseData:{},
      currencyList:[]
    }
  },
  methods:{
    submitExpense(){
      const randomId = uuidv4()
      const db = getDatabase()
      set(ref(db,`tracks/${randomId}`),{
        id:randomId,
        type:'Expense',
        amount:this.expenseData.amount,
        date:Date.now(),
        fullDate:this.store.globalSetDate(),
        detail:this.expenseData.detail,
        currency:this.expenseData.selectedCurrency
      })
      this.expenseData = {}
      this.$q.notify({
        type:'positive',
        message:'Submitted',
        icon:'check',
        timeout:600,
        position:'bottom'
      })
    },
    clearAll(){
      this.expenseData = {}
    },
    selectCurrencyType(data){
      const result = this.store.currencyList.find(object => object === data)
      if(result){
        this.expenseData.selectedCurrency = result
      }
    },
    goback(){
      this.store.expenseComponentActive = false
    },
/*     async getCurrencyList(){
      const url = 'https://currency-exchange.p.rapidapi.com/listquotes';
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
        const result = await response.json();
        this.currencyList = result
        console.log(this.currencyList)
      } catch (error) {
        console.error(error);
      }
    }, */
  },
  created(){
    this.store.getCurrencyList()
  },
  mounted(){

  },
  watch:{

  }
}
</script>

<style>

</style>
