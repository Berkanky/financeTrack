<template>
  <q-dialog
    v-if="this.store.updateActive" v-model="this.store.updateActive"
    :maximized="this.store.mobileActive ? true : false"
    :full-height="this.store.mobileActive ? true : false"
    persistent
    dark
  >
  <q-card
    style="border-radius:7px;"
    :style="{'width':this.store.mobileActive ? '100%' : '450px','height':this.store.mobileActive ? '100%' : '600px'}"
    class="bg-dark text-white text-capitalize"
  >
  <q-card-section class="text-left">
    <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
  </q-card-section>
  <q-card-section class="text-center">
    <div class="text-h6 text-grey-6">
      {{ this.store.updateData.type }}
    </div>
  </q-card-section>
  <q-card-section>
    <q-input
      standout="bg-primary text-white" dark  :label="this.store.updateData.amount ? this.store.updateData.amount : 'Enter New Amount'" type="number" v-model="this.store.updateData.amount">
      <template v-slot:prepend>
        <q-icon name="pin" color="white"></q-icon>
      </template>
      <template v-slot:append v-if="this.store.updateData.amount">
        <q-btn icon="remove" color="white" text-color="dark" round size="sm" v-on:click="this.store.updateData.amount = ''"></q-btn>
      </template>
    </q-input>
  </q-card-section>
  <q-card-section class="text-center">
        <q-btn-dropdown color="primary" :label="this.store.updateData.currency ? this.store.updateData.currency : 'Currency Type'">
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
          standout="bg-primary text-white" dark  :label="this.store.updateData.detail ? this.store.updateData.detail : 'Enter New Detail'" v-model="this.store.updateData.detail">
          <template v-slot:prepend>
            <q-icon name="info" color="white"></q-icon>
          </template>
          <template v-slot:append v-if="this.store.updateData.detail">
            <q-btn icon="remove" color="white" text-color="dark" round size="sm" v-on:click="this.store.updateData.detail = ''"></q-btn>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="text-right">
        <q-btn icon="edit" color="green" v-on:click="updateTrack"></q-btn>
      </q-card-section>
  </q-card>
  </q-dialog>
</template>

<script>
import { getDatabase, ref, set, remove, update, onValue, query, orderByChild } from "firebase/database";
import {useCounterStore} from '../stores/store'
export default {
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
    updateTrack(){
      const db = getDatabase()
      update(ref(db,`tracks/${this.store.updateData.id}`),{
        amount:this.store.updateData.amount ? this.store.updateData.amount : '',
        currency:this.store.updateData.currency ? this.store.updateData.currency : '',
        detail:this.store.updateData.detail ? this.store.updateData.detail : '',
        fullDate:this.store.globalSetDate(),
        date:Date.now(),
      })
      this.store.updateActive = false
      this.$q.notify({
        type:'positive',
        position:'top',
        timeout:700,
        icon:'check',
        message:'Updated !'
      })
      this.store.updateData = {}
    },
    selectCurrencyType(data){
      this.store.updateData.currency = data
    },
    goBack(){
      this.store.updateActive = false
    }
  },
  created(){

  },
  mounted(){

  },
  watch:{

  }
}
</script>

<style>

</style>
