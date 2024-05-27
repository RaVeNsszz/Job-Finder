const express    = require('express');//chamar o express
const exphbs     = require('express-handlebars');//importado o handlebars
const app        = express();// cria a servidor
const path       = require('path');//consegue entender meu diretório base da aplicação 
const db         = require('./db/connection'); // constante do banco de dados
const bodyParser = require('body-parser');
const Job        = require('./models/Job');
const Sequelize  = require('sequelize');
const Op         = Sequelize.Op;// consultas mais complexas, requisições mais complexas


const PORT = 3000; // criando a porta

app.listen(PORT,function(){// função anonima que vai dizer aonde o express está rodando
    console.log(`O Express está rodando na porta ${PORT} `)
});

//body parser
app.use(bodyParser.urlencoded({extends : false}));

//handle bars
app.set('views', path.join(__dirname,'views'));//arquivos staticos
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));//leyout principal da aplicação, o que se repete
app.set('view engine','handlebars');//Framework ultilizado para redenrizar as views

// static folder
app.use(express.static(path.join(__dirname,'public'))); //setei qual a pasta de arquivos estaticos

//db conncetion
db
    .authenticate()//conecção, retorna uma then
    .then(()=>{
        console.log('Conectou ao banco com sucesso')
    })
    .catch(err =>{
        console.log('Ocorreu um erro ao conectar'.err);
    });

//routes
app.get('/',(req, res)=>{  //Rota

    let search = req.query.job;
    let query  = '%'+search+'%';//PH -> PHP. Word -> Wordpress, press -> Wordpress

    if(!search){
        Job.findAll({order: [//vai encontrar todas as jobs que tenho salvas e ordenar no array
            ['createdAt','DESC']// desc = os registros são ordenados do mais novo prpo mais velho    
        ]})
        .then(jobs => {
         res.render('index', {//renderizar o index.handlebars, que é o corpo do main.handlebars(estatico)
                jobs // redenrizar a view com as jobs dentro dela
         });
        })
        .catch(err => console.log(err));
    }else {
        Job.findAll({
            where: {title: {[Op.like]: query}},//fazer um consulta baseada no titulo de acordo com oq se pesquisou
            order: [
                ['createdAt','DESC']
        ]})
        .then(jobs => {
         res.render('index', {
            jobs, search
         });
        });

    }


    
});

// jobs routes
app.use('/jobs', require('./routes/jobs'));
