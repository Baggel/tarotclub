
const fs            = require("fs");
const marked        = require('marked'); // markdown to HTML
const yaml          = require('js-yaml');
const daysjs        = require('dayjs'); 

// ============================================================================
// GLOBAL VARIABLES
// ============================================================================
var NEWS_PER_PAGE = 4;

// Cache of blog entries
// Key is the date, then the object containing the title and the text
var BlogEntries = {
//       '2011-12-31':  { title: "blahblah",  text:"Dans quelle état j'ère ?" },
//       '2013-12-31':  { title: "Deus",  text:"Machina" }
};

var MarkeOptions = {
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  };
  

// ============================================================================
// GLOBAL FUNCTIONS
// ============================================================================

// List all files [as directory tree] in Node.js recursively in a synchronous fashion
var walkSync = function(dir) {

    var files = fs.readdirSync(dir);
    var filelist = [];
    files.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist.push(walkSync(dir + '/' + file));
        }
        else { filelist.push(file); }
    });
    return filelist;
};

function GetFrontMatter (lines) {
    if ((/^---/).test(lines[0].trim())) {
      var frontMatter = [];
      lines.shift();
      var line;
      // Keep shifting off lines till we find the next ---
      while (!(/^---/).test(line = lines.shift().trim())) {
        frontMatter.push(line);
      } 
      return frontMatter.join('\n');
    } else {
      return '';
    }
  };
  
  // Periodically check new blog entries in the file system
  function CheckNews()
  {  
      var entries = walkSync("blog");
  
      // entries is now filled with something like:
      // [ '2011-12-31-new-years-eve-is-awesome.md', '2015-06-25-version-2.6.2-disponible.md' ]
  
      entries.forEach(function(value, index) {
  
          try
          {
              var contents = fs.readFileSync('blog/' + value, 'utf8');
              // Extract the date
              var arr = value.match(/(\d{4}-\d{2}-\d{2})/) || [];
  
              if (arr.length == 2)
              {
                  var date = arr[1];
  
                  // Parse the YAML header
  
                   // Generate frontMatter and actual markdown content
                  var lines = contents.split('\n');
                  var frontMatter = GetFrontMatter(lines);
                  var newContent = lines.join('\n');
                  var html = marked(newContent, MarkeOptions);
  
                  var matter = frontMatter ? yaml.load(frontMatter) : {};
  
                  // Add entry, key is the date
                  BlogEntries[date] = { 
                     // yaml: frontMatter.trim(),
                    //  markdown: newContent.trim(),
                      content: html.trim(),
                      meta: matter
                    };
              }
              else
              {
                  logger.error('Bad array size: ', arr.length, value);
              }
     
          }
          catch(e)
          {
              logger.error('Error while parsing markdown blog entries');
          }
      
      });
  }


var GetBlogEntries = function(page) {
    var list = [];

    Object.keys(BlogEntries)
      .sort(function keyOrder(k1, k2) {

            // Sort descending (from most recent news to oldest one)
            if (daysjs(k1).isAfter(k2)) return -1;
            else if (daysjs(k1).isBefore(k2)) return +1;
            else return 0;
        })
      .forEach(function(v, i) {
            var entry = {};
            entry.date = daysjs(v).format("dddd D MMMM YYYY");
            entry.text = BlogEntries[v].content;
            entry.title = BlogEntries[v].meta.title;
            list.push(entry);
       });

    //console.log(list);
    return list;
};



// ============================================================================
// REST API
// ============================================================================
function getNews(req, reply)
{
    console.log("[DOCS] Get news called"); 
    reply.code(200).send({
        success: true,
        data: GetBlogEntries(0),
        message: 'Get news'
    });
}


const env = process.env.NODE_ENV || 'dev';

// Check every minute several website stuff
let scanInterval = 60000; // Production value
if (env == 'dev')
{
    scanInterval = 5000; // development value
}
// Periodic check news and docs
setInterval(CheckNews, scanInterval);

module.exports = async function (fastify) {

//   fastify.get('/help', getHelp);
  fastify.get('/news', getNews);
}



