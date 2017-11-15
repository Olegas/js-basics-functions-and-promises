var Waiter = {
	_getOrder: function(client) {
		var item, order = [];
		while(item = client.waitForOrderItem()) {
			order.push(item);
		}
		this.say('Скоро все будет готово!');
		return order;
	},
	pleaseTakeMyOrder: function(client) {
		var order = this._getOrder(client);
		return getOrderDone(order);
	}
};

// Waiter.pleaseTakeMyOrder -> Promise, Deferred result

// Waiter.pleaseTakeMyOrder -> Deferred<Dishes>

Waiter.pleaseTakeMyOrder(me).addCallback(function(order) {
	me.eat(order);
});

// Но что если заказ не может быть приготовлен?

Waiter.pleaseTakeMyOrder(me).addCallback(function(dishes) {
	me.eat(dishes);
}).addErrback(function(regrets){
	me.sad();
});

// А что внутри у официанта?

function getOrderDone(order) {
	return Kitchen.cook(order);
}

// А если на кухне сломалась духовка?

Waiter.pleaseTakeMyOrder(me)
// .addCallback
.addErrback(function(regrets){
	// regrets == 'Колян, духовка возрвалась, скажи что утку не можем сделать!'
	// me.sad();
	me.angry();
	me.getout();
});

// Хороший официант не допустит такой ерунды!

function getOrderDone(order) {
	return Kitchen
		.cook(order)
		.addErrback(function(badThingsHappens) {
			return new Error('К сожалению, ...');
		})
}

Waiter.pleaseTakeMyOrder(me)
	// .addCallback
	.addErrback(function(regrets){
		// regrets == 'К сожалению, ...'
		me.sad();
		me.tryChangeOrder();
	});

// А что же происходит на кухне?

var Kitchen = {
	cook: function(order) {
		return Chief.cookFood(order);
	}
};

// А что если заказ не только с кухни?
function getOrderDone(order) {
	var fromBar = onlyBarItems(order),
		fromKitchen = onlyKitchenItems(order);

	// ???
}

// Как поступит плохой официант?
function getOrderDone(order) {
	var fromBar = onlyBarItems(order),
		fromKitchen = onlyKitchenItems(order);

	var result = new Deferred();

	Kitchen.cook(fromKitchen).addCallback(function (dishes) {
		Bar.get(fromBar).addCallback(function (wine) {
			result.success([dishes, wine]);
		})
	});

	return result;
}

// А ошибки?
// А чего так долго? А побыстрее? А вы нам и вилки с ножами по одному будете приносить?
// В нашем ресторане такие не работают!

function getOrderDone(order) {
	return new ParallelDeferred({
		steps: [
			Kitchen.cook(fromKitchen),
			Bar.get(fromBar)
		]
	}).done().getResult().addErrback(function(badThingsHappens) {
		return new Error('К сожалению, ...');
	})
}

// Примеры асинхронных операций в JS: таймер, внешняя загрузка
// В языке штатно нет (ну, или небыло) Deferred/Promise
// callback
// чем плохо?
// Promise (аналогии с Deferred для кругозора)


