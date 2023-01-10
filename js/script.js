const app = {
    data() {
        return {
            produtos:[],
            produtoInfo:false,
            avaliacoes:[],

            /* Modal */
            modal:false,
            modalAtivo: 'ativo',
            /* Carrinho */
            carrinho:[],
            modalCarrinho:false,
            itemTrue:false,
            /*Estoque */
            semEstoque:false,
            mensagemAdicionar:false
        }
    },
    methods:{
        async getProdutos(){
            const response = await fetch("./api/produtos.json")
            const data = await response.json()
            this.produtos = data
        },
        //Seta o produto clicado no array
        async getProdutoInfo(id){
            const response = await fetch(`./api/produtos/${id}/dados.json`)
            const data = await response.json()
            this.produtoInfo = data
            this.avaliacoes = data.reviews
        },
        abrirModal(id){
            //Rola a tela para o inicio
            scroll({
                top:0,
                behavior: "smooth"
            })
            //Toggle modal
            this.modal = !this.modal
            //Traz o produto clicado
            this.getProdutoInfo(id)
        },
        fecharModal(){
            this.modal = !this.modal
        },
        //Adiciona item ao carrinho e setar no localStorage
        adicionarItem(a,event){
            const id = this.produtoInfo.id
            const nome = this.produtoInfo.nome
            const preco = this.produtoInfo.preco
            this.produtoInfo.estoque--
            this.carrinho.push({id,nome,preco})
            this.salvarValores(id,nome,preco)
            this.verificarEstoque()
            this.produtoAdicionado()
        },
        //Chama a mensagem de produto adicionado
        produtoAdicionado(){
            this.mensagemAdicionar = true
            setTimeout(() => {
                this.mensagemAdicionar = false
            }, 900);
        },
        //Remove produto do carrinho        
        removerItem(id){
            this.produtoInfo.estoque++
            this.carrinho.splice(id,1)
            this.excluirCookie(id)
        },
        //Abre modal do carrinho
        toggleCarrinho(){
            this.modalCarrinho = !this.modalCarrinho
        },
        // ----- Local Storage ------

        //Salvar cookie
        salvarValores(id,nome,preco){
            const produtos = {id,nome,preco}
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
        },
        
        // ----- Fim Local Storage ------
        compararEstoque(){
            //Se algum produto do estoque estiver no carrinho,
            //Verifica a quantidade e subtrai o valor
            const itensFiltrados = this.carrinho.filter((item) => 
            item.id === this.produtoInfo.id
            )
            this.produtoInfo.estoque -= itensFiltrados.length
        },
        
        verificarEstoque(){
            const adicionarProduto = document.querySelector('#adicionarProduto')
            if(this.produtoInfo.estoque === 0){
                this.semEstoque = true
                adicionarProduto.innerText = 'Produto Esgotado'
            }else{
                this.semEstoque = false
                adicionarProduto.innerText = 'Adicionar Produto'
            }
        }
    },
    mounted(){
        this.getProdutos()
        this.verificarEstoque()
    },
    watch:{
        produtoInfo(){
            if(this.produtoInfo){
                this.compararEstoque()
                this.verificarEstoque()
            }
        },
    },
    computed:{
        somaProduto(){
            this.carrinho = this.pegarCookie()
            //Verifica se tem algum item no carrinho
            this.carrinho.length > 0 
            ? this.itemTrue = true 
            : this.itemTrue = false

            //Soma os valores do carrinho
            const valores = this.carrinho.map((item) => item.preco)
            const result = valores.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0);
                return result
            }
        }
    }
    
    Vue.createApp(app).mount('#produtos')