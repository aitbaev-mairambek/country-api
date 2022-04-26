const Routes = [
	{
		title: 'Alle countries',
		route: 'all'
	},
	{
		title: 'Africa',
		route: 'africa'
	},
	{
		title: 'Americas',
		route: 'americas'
	},
	{
		title: 'Asia',
		route: 'asia'
	},
	{
		title: 'Europe',
		route: 'europe'
	},
	{
		title: 'Ocean',
		route: 'ocean'
	},
]

const endPointList = {
	all: 'all',
	region: 'region',
	capital: 'capital',
	name: 'name'
}


const $navList = document.querySelector('.navList')
const $container = document.querySelector('.row')
const $loader = document.querySelector('.loader')
const $title = document.querySelector('.title')

const $select = document.querySelector('.select')
const $input = document.querySelector('.input')
const $toggle = document.querySelector('.toggle')
const $moon = document.querySelector('.moon')


window.addEventListener('load' , () => {

	$loader.innerHTML = '<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>'

	getBase(`${endPointList.all}` , res => {
		Template(res)
	})

	const template = Routes.map(item => {
		return `
			<li><a href="#" onclick="getRoute('${item.route}')">${item.title}</a></li>
		`
	}).join('')

	$navList.innerHTML = template
})


function getBase(endPoint , cb) {
	fetch(`https://restcountries.com/v3.1/${endPoint}`)
	.then(res => res.json())
	.then(res => cb(res))
}


function getRoute(route) {
	if (route === 'all') {
		getBase(`${route}/` , res => {
			Template(res)
		})
	} else {
		getBase(`${endPointList.region}/${route}` , res => {
			Template(res)
		})
	}
}

function Template(data) {
	const template = data.map(item => {
		return `
			<div class="card" onclick="More('${item.name.common}')">
				<div class="card-image">
					<img src="${item.flags.svg}" class="cardImg">
				</div>
				<div class="card-body">
					<h5><strong>${item.name.common}</strong></h5>
					<p><strong>Population: </strong> ${item.population}</p>
					<p><strong>Region: </strong> ${item.region}</p>
					<p><strong>Captital: </strong> ${item.capital}</p>
				</div>
			</div>
		`
	}).join('')

	$container.innerHTML = template
}

function More(name) {
	getBase(`${endPointList.name}/${name}` , res => {
		countryTemplate(res)
	})
}

function countryTemplate(data) {
	const template = data.map(item => {
		$title.innerHTML = item.name.common
		return `
			<div class="contryModal">
				<button class="back" onclick="Back()">Back</button>
				<div class="modal">
					<div class="leftModal">
						<img src="${item.flags.svg}" alt="flag">
					</div>
					<div class="rightModal">
						<h1>${item.name.common}</h1 >
						<div class="modalInfo">
							<div class="innerLeft inner">
								<p><strong>Official Name:</strong> ${item.name.official}</p>
								<p><strong>Population:</strong> ${item.population}</p>
								<p><strong>Region:</strong> ${item.region}</p>
								<p><strong>Sub-region:</strong> ${item.subregion}</p>
							</div>
							<div class="innerRight inner">
								<p><strong>Capital:</strong> ${item.capital}</p>
								<p><strong>Top Level Domain:</strong> ${item.tld}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		`
	}).join('')

	$container.innerHTML = template
}

function Back() {
	window.location.reload()
}

$select.addEventListener('change' , e => {
	var value = e.target.value

	if (value === 'capital') {
		$input.setAttribute('placeholder' , 'Search by capital...')
	} else if (value === 'name') {
		$input.setAttribute('placeholder' , 'Search by name...')
	}

})

$input.addEventListener('input' , e => {
	var value = e.target.value
	var selected = $select.value

	if (selected === 'capital') {
		getBase(`${endPointList.capital}/${value}` , res => {
			Template(res)
		})
	} else {
		getBase(`${endPointList.name}/${value}` , res => {
			Template(res)
		})
	}

})

$toggle.addEventListener('click' , e => {
	e.preventDefault()
	document.body.classList.toggle('dark')
	$moon.classList.toggle('fas')
})