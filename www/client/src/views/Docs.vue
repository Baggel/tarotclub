<template>
<div class="container is-max-widescreen">
<div class="columns is-centered" style="padding: 2rem">
    <div class="column is-2">
        <div class="category">
            <h1 class="title is-5">Sommaire</h1>
            <hr />
            <ul>
                <li v-for="d in docs" :key="d.title">
                    <i class="mdi mdi-chevron-right-circle"></i>&nbsp;&nbsp;&nbsp;{{d.title}}
                    
                </li>
            </ul>
        </div>
    </div>
    <div class="column is-10">
        <h1>Blah</h1>
    </div>
</div>

</div>
</template>

<script>
export default {

    components: {

    },
    created() {
        
    },
    data: () => ({
        docs: []
    })
}
</script>
