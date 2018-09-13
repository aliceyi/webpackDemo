

<template>
    <div :class="$style.home">
        <h1>Home
        <div :class="$style.title">222</div>
        </h1>
    </div>
</template>

<script>
export default {
}
</script>

<style lang="stylus" module>
@import '../../css/reset.styl';
  .home{
    color: red;
    font-size: 80px;
  }
  .title{
    height: 100px;
    width:100px;
    background:red;
  }
</style>


