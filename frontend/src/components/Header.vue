<template>
    <header class = "header">
        <h1>Mi Vue App</h1>
        <button @click="toggleTheme">
            cambiar a {{ darkMode ? 'modo claro' : 'modo oscuro' }}
        </button>
    </header>
</template>

<script>
export default{
    name: 'Header',
    props: ['darkMode'],
    emits: ['toggleTheme'],
    methods: {
        toggleTheme() {
            this.$emit('toggleTheme')
        }
    }
}

</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color:var(--header-bg);
    color:var(--text-color);

}
button {
    padding: 0,5rem 1rem;
}
</style>