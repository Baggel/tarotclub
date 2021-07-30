<template>
  <div class="card">
    <div class="content has-text-centered">

      <span class="icon-text">
        <p class="title is-4">
          <span class="icon">
              <i :class="'mdi mdi-48 ' + icon"></i>
          </span> {{descr}}
        </p>
      </span>
    </div>

    <footer class="card-footer">
      <a href="#" class="card-footer-item">Download</a>
    </footer>
  </div>
</template>

<script>
export default {
    props: {
      icon: {
        type: String,
        required: true
      },
      descr: {
        type: String,
        required: true
      },
    },
    data () {
      return {
      }
    }
}
</script>
