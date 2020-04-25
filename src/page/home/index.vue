<template>
  	<div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
    </div>
</template>

<script>
import itemcontainer from '../../components/itemcontainer'

export default {
	name: 'home',
  	components: {
  		itemcontainer
  	},
    created(){

    }
}
</script>

<style lang="less" scoped>
    .home_container{
position: relative;
    height: 100%;
    width: 100%;
    }
</style>
