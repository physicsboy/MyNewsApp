const BaseUrl = "https://newsapi.org/v2/";
const ApiKey = "a5b198aa7a494bce8215c66774a4919f";

function buildUrlSource (source) {
    return BaseUrl + "top-headlines?sources=" + source + "&apiKey=" + ApiKey;
}
function buildUrlCountry (country) {
    return BaseUrl + "sources?language=en&country=" + country + "&apiKey=" + ApiKey;
}

Vue.component('article-list', {
    props: ['results'],
    template: `
        <section>
            <div class="row" v-for="posts in processedPosts">
                <div class="columns large-4" v-for="post in posts">
                <div class="card">
                    <div class="card-divider" style="background: rgb(59, 59, 59)">
                    <a :href="post.url" style="color:white; font-weight:bold">{{ post.title }}</a>
                    </div>
                    <a :href="post.url"><img :src="post.image_url"></a>
                    <div class="card-section">
                    <p>{{ post.description }}.</p>
                    </div>
                </div>
                </div>
            </div>
        </section>
    `,
    computed: {
        processedPosts() {
            let posts = this.results;
            
            //add image_url
            posts.map(post => {
                post.image_url = post.urlToImage || "http://via.placeholder.com/300x200";
            });

            //put into chunks
            let i, j, chunkedArray = [], chunk = 3;
            for (i=0, j=0; i<posts.length; i+=chunk, j++) {
                chunkedArray[j] = posts.slice(i, i+chunk);
            }
            return chunkedArray;
        }
    }
});

const vm = new Vue({
    el: '#app',
    data: {
        countries: [
            {
                name: 'Australia',
                code: 'au'
            },
            {
                name: 'USA',
                code: 'us'
            },
            {
                name: 'Britain',
                code: 'gb'
            },
            {
                name: 'Canada',
                code: 'ca'
            },
            {
                name: 'Italy',
                code: 'it'
            },
            {
                name: 'India',
                code: 'in'
            },
            {
                name: 'South Africa',
                code: 'za'
            },
            {
                name: 'Ireland',
                code: 'ie'
            }
        ],
      sources: [],
      results: [],
      loadSource: true,
      loadCountry: true,
      source: 'bbc-news', // Default news feed to BBC News
      country: 'gb' // Default country to Britain (gb)
    },
    mounted() {
        this.getSources('gb'); // Default to British News
        this.getPosts('bbc-news'); // Default view to BBC News        
    },
    methods: {
        getPosts(source) {
            let url = buildUrlSource(source);
            axios.get(url).then((response) => {
                this.results = response.data.articles;
            }).catch(error => {console.log(error)})
            this.loadSource = false;
        },
        getSources(country) {
            let url = buildUrlCountry(country);
            axios.get(url).then((response) => {
                this.sources = response.data.sources;
            }).catch(error => {console.log(error)})
            this.loadCountry = true;
        },
        isLoaded() {
            return(this.loadCountry && this.loadSource);
        }
    }   
  });