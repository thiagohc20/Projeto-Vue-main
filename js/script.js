const app = {
    data() {
        return {
            produtos:[],
            produtoInfo:[],
            avaliacoes:[],
            modal:false,
            modalAtivo: 'ativo',
            carrinho:[]
        }
    },
    methods:{
        async getProdutos(){
            const response = await fetch("./api/produtos.json")
            const data = await response.json()
            this.produtos = data
        },
        async getProdutoInfo(id){
            const response = await fetch(`./api/produtos/${id}/dados.json`)
            const data = await response.json()
            this.produtoInfo = data
            this.avaliacoes = data.reviews
        },
        abrirModal(id){
            this.modal = !this.modal
            this.getProdutoInfo(id)
        },
        fecharModal(){
            this.modal = !this.modal
        },
        adicionarItem(id){
          const item = 1
          console.log(this.carrinho.push(item))
        }
    },
    mounted(){
        this.getProdutos()
    }
}

Vue.createApp(app).mount('#produtos')