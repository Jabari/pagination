var TIME = 1000, httpGetAsync, timeout, company, companies, makeListItemsClickable, prev, next, query, page, sliceBegin = 0, sliceEnd = 5;

document.addEventListener("DOMContentLoaded", function() {
  var search = document.querySelector('#search');
  var submit = document.querySelector('#submit');

  search.focus();

  var searchTimeout = function() {
    timeout = setTimeout(function() {
      query = '/api/companies?q=' + encodeURIComponent(search.value.trim());
      httpGetAsync(query, sliceBegin, sliceEnd);
    }, TIME);
  }

  search.addEventListener('keypress', function() {
    clearTimeout(timeout);
    searchTimeout();
  });

  var httpGetAsync = function(theUrl, beg, end) {
    var xmlHttp = new XMLHttpRequest();
    page = end / 5;
    document.querySelector('.page').textContent = page;
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        console.log(xmlHttp.responseText)
        var data = JSON.parse(xmlHttp.responseText);
        var results = data["results"];
        document.querySelector('#results').innerHTML = '';
        results.slice(beg, end).map(function(company) {
          document.querySelector('#results').insertAdjacentHTML('beforeend', '<li class="company">' + company.name + '</li>');
          document.querySelector('#results:last-child').addEventListener('click', function(e) {
            if (document.querySelector('.open')) {
              document.querySelector('.open').nextElementSibling.style.display = "none";
              document.querySelector('.open').classList.remove('open');
            }
            e.target.className += " open"
            e.target.nextElementSibling.style.display = "block";
          });
          document.querySelector('#results:last-child').insertAdjacentHTML('beforeend', '<ul class="details"></ul>');
          document.querySelector('.details:last-of-type').insertAdjacentHTML('beforeend', '<li><img src="' + company[`avatarUrl`] + '" /></li>');
          document.querySelector('.details:last-of-type').insertAdjacentHTML('beforeend', '<li>' + company[`laborType`] + '</li>');
          document.querySelector('.details:last-of-type').insertAdjacentHTML('beforeend', '<li><a href="tel:' + company['phone'] + '">' + company['phone'] + '</a></li>');
          document.querySelector('.details:last-of-type').insertAdjacentHTML('beforeend', '<li><a target="_blank" href="' + company['website'] + '">' + company['website'] + '</a></li>');
        })
        console.log(xmlHttp.responseText)
      }
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);

    makeListItemsClickable();
  }

  makeListItemsClickable = function() {
    companies = document.querySelectorAll('.company');

    for (var i = 0; i < companies.length; i++) {
      companies[i].addEventListener('click', function(e) {
        console.log(e)
      });
    }
  }

  prev = document.querySelector('#prev');
  next = document.querySelector('#next');

  prev.addEventListener('click', function() {
    sliceBegin = sliceBegin - 5;
    sliceEnd = sliceEnd - 5;
    httpGetAsync(query, sliceBegin, sliceEnd);
  })

  next.addEventListener('click', function() {
    sliceBegin = sliceBegin + 5;
    sliceEnd = sliceEnd + 5;
    httpGetAsync(query, sliceBegin, sliceEnd);
  })
});