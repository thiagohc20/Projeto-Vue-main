const app = {
    data() {
        return {
            produtos:[],
            produtoInfo:[],
            avaliacoes:[],

            /* Modal */
            modal:false,
            modalAtivo: 'ativo',
            /* carrinho */
            carrinho:[],
            modalCarrinho:false,
            itemTrue:false
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
        adicionarItem(){
            const id = this.produtoInfo.id
            const nome = this.produtoInfo.nome
            const preco = this.produtoInfo.preco
            this.produtoInfo.estoque--
            this.carrinho.push({id,nome,preco})
            this.carrinho.length > 0 ? this.itemTrue = true : this.itemTrue = false
        },
        removerItem(id){
            console.log(this.carrinho[id].remove())
        },
        toggleCarrinho(){
            this.modalCarrinho = !this.modalCarrinho
        }
    },
    mounted(){
        this.getProdutos()
    },
    computed:{
        somaProduto(){
            const valores = this.carrinho.map((item) => item.preco)
            const result = valores.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0);
            return result
        }
    }
}

Vue.createApp(app).mount('#produtos')