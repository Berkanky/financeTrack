<template>
  <div class="appAll">
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useCounterStore } from './stores/store';
export default defineComponent({
  name: 'App',
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
    handleResize() {
      this.store.window.width = window.innerWidth;
      this.store.window.height = window.innerHeight;
      //console.log('window',this.window)
    },
  },
  created(){
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  mounted(){
    document.body.classList.add('hide-scrollbar');
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  watch:{
    'store.window':{
      handler(newValue,oldValue){
        if(newValue.width<580){
          this.store.newHeight = 300
          this.store.mobileActive = true
          console.log('newHeight',this.store.newHeight)
          console.log('avatar',this.store.mobileActive)
        }else{
          this.store.newHeight = ''
          this.store.mobileActive = false
          console.log('avatar',this.store.mobileActive)
          console.log('newHeight',this.store.newHeight)
        }
      },
      immediate:true,
      deep:true
    },
  }
})
</script>

<style>
.hide-scrollbar {
  overflow: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* Hide scrollbar for Chrome, Safari, and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.appAll{
  font-family: 'Roboto', sans-serif;
}
</style>
