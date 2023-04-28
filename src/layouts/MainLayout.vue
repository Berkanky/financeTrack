<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-grey-9 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img :src="logoImage" alt="">
          </q-avatar>
          Finance Tracker
        </q-toolbar-title>
        <q-space></q-space>
        <q-icon name="account_balance_wallet" color="white" class="q-mr-sm" size="19px"></q-icon>
        <span>
          Balance : {{ this.checkTotalTracks() }}
        </span>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-9 text-white" v-if="this.store.mobileActive ? false : true">
      <q-toolbar>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import logoImage from '../images/track.png'
import { useCounterStore} from 'src/stores/store';
export default {
  setup(){
    const store = useCounterStore()
    return{
      store,
      logoImage
    }
  },
  data:function(){
    return{

    }
  },
  methods:{
    checkTotalTracks(){
      if(this.store.totalTracks.incomes.length && this.store.totalTracks.expenses.length){
        const incomes = this.store.totalTracks.incomes[0].amount
        const expenses = this.store.totalTracks.expenses[0].amount
        const balance = Number(incomes) - Number(expenses)
        return balance.toFixed(3)
      }else{
        return 0
      }
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
