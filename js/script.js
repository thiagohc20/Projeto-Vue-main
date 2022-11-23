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
        //Funcao para adicionar item ao carrinho e setar no localStorage
        adicionarItem(){
            const id = this.produtoInfo.id
            const nome = this.produtoInfo.nome
            const preco = this.produtoInfo.preco
            this.produtoInfo.estoque--
            this.carrinho.push({id,nome,preco})
            this.salvarValores(id,nome,preco)
        },
        //Funcao para remover produto do carrinho        
        removerItem(id){
            this.produtoInfo.estoque++
            this.carrinho.splice(id,1)
            this.excluirCookie(id)
        },
        //Funcao para abrir modal do carrinho
        toggleCarrinho(){
            this.modalCarrinho = !this.modalCarrinho
        },
        // ----- Local Storage ------

        //Salvar cookie
        salvarValores(id,nome,preco){
            const produtos = {id,nome,preco}
            console.log(produtos)
            let itens = this.pegarCookie()
            itens.push(produtos)
            localStorage.setItem("produtos", JSON.stringify(itens))
        },
        
        //Retornar o cookie salvo
        pegarCookie(){
            return localStorage.getItem("produtos")
            ? JSON.parse(localStorage.getItem("produtos"))
            : []
        },
        
        //Exluir cookie
        excluirCookie(id){
            let itens = this.pegarCookie()
            itens = itens.filter(function (item,index){
            if(index !== id){
                return item
            }
            })
            localStorage.setItem("produtos", JSON.stringify(itens))
        }

    },
    mounted(){
        this.getProdutos()
    },
    computed:{
        somaProduto(){
            this.carrinho = this.pegarCookie()
            //Verifica se tem algum item no carrinho
            this.carrinho.length > 0 
            ? this.itemTrue = true 
            : this.itemTrue = false

            const valores = this.carrinho.map((item) => item.preco)
            const result = valores.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0);
                return result
            }
        }
    }
    
    Vue.createApp(app).mount('#produtos')