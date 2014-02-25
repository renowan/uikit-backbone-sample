(function(){

	var MyModel = Backbone.Model.extend({});

	var MainModel = Backbone.Model.extend({
		initialize: function() {
		},
		startFetch: function(){
			this.fetch({
				type: 'GET',
				url: 'prod.json',
				dataType: 'json',
				success: function(a,b,c) {
					console.log("success!",a);
				},
				error:function(xhr,status,errorThrown) {
					console.log("unsuccess!");
				}
			});
		}
	});

	var PaymentModel = Backbone.Model.extend({
		initialize: function() {
		},
		register: function(){

			var cartArr = this.get('cart');
			var nameArr = [],nameUniqArr = [],result = [];

			_.each( cartArr , function( prodObj ){
				nameArr.push(prodObj.name);
			} );
			nameUniqArr = _.uniq(nameArr);
			_.each( nameUniqArr , function( uniqName ){
				var count = prodCount(uniqName);
				var price = findPrice(uniqName);
				var totalAmount = count * price;
				result.push( { name:uniqName , count:count , price:price ,totalAmount:totalAmount} );
			} );

			function prodCount( prodName ){
				var count = 0;
				for (var i = 0; i < nameArr.length; i++) {
					if(nameArr[i] == prodName){
						count ++;
					}
				};

				return count;
			}

			function findPrice( prodName ){
				var result = _.find(cartArr, function(prod){ return prod.name == prodName; });
				return result.price;
			}

			return result;
		},
		getPaymentTotal: function(){
			var cartArr = this.get('cart');
			var priceResult = 0;
			_.each( cartArr , function(prod){
				priceResult += prod.price;
			});
			return priceResult;
		}
	});

	var PaymentView = Backbone.View.extend({
		el:'#cart-list',
		initialize: function() { 
			this.listenTo( paymentModel , 'change' , this.render );
		},
		render: function(){
			console.log('pay render!!!!');
			var registerArr = paymentModel.register();
			$('#cart-list').html('');
			var html = '';
			_.each( registerArr , function(prod){
				console.log('prod',prod);
				html += $('#registerTemplate').render(prod);
			});

			var paymentTotal = paymentModel.getPaymentTotal();
			html += '<span class="label-prod total">Total</span>';
			html += '<span class="label-val"></span>';
			html += '<span class="label-price total">¥'+paymentTotal+'</span>';
			$('#cart-list').html(html);


			console.log('paymentModel',paymentModel);
		}
	});

	var ProdView = Backbone.View.extend({
		el: '<li>',
		events:{
			'click a': 'buy'
		},
		initialize: function() {
		},
		buy:function(){
			paymentModel.get('cart').push(this.model.attributes.prod);
			paymentModel.trigger('change');
			// console.log(paymentModel);
		},
		render: function(){
			// console.log(this.model);
			this.$el.html('<span class="products-name">'+this.model.get('prod').name+'</span><span class="products-price">¥'+this.model.get('prod').price+'</span><a class="uk-button" href="#">Buy</a>');
			return this;
		}
	});

	var CategoryView = Backbone.View.extend({
		el: '<li>',
		events:{
			'click a': 'changeCate'
		},
		initialize: function() {
			// this.render();
		},
		changeCate: function(){
			$('#prod-list').html('');
			_.each( this.model.get('cate').list , function( prod ){
				var prodModel = new MyModel();
				prodModel.set('prod',prod);
				var prodView = new ProdView({model:prodModel});
				$('#prod-list').append(prodView.render().el);
			});
		},
		render: function(){
			// console.log(this.model);
			this.$el.html('<a href="#">'+this.model.get('cate').category+'</a>');
			return this;
		}
	});

	var AppView = Backbone.View.extend({
		el: 'body',
		events:{

		},
		initialize: function() {
			this.listenTo( mainModel , 'change' , this.loadJsonComplete );
			mainModel.startFetch();
		},
		loadJsonComplete: function(){
			console.log('ol');
			this.renderCate();
		},
		renderCate: function(){
			_.each( mainModel.get('prod') , function( cate ){
				var model = new MyModel();
				model.set('cate',cate);
				var cateView = new CategoryView({model:model});
				$('#category-list').append(cateView.render().el);
			});
		}
	});

	var paymentModel = new PaymentModel;
	paymentModel.set('cart',[]);
	var paymentView = new PaymentView;
	var categoryView = new CategoryView;
	var mainModel = new MainModel;
	var appView = new AppView;

	/*var test = [
		{name: "Macaron",price: 85},
		{name: "Macaron",price: 85},
		{name: "spaghetti",price: 100},
		{name: "Macaron",price: 85},
		{name: "cola",price: 185},
		{name: "gaga",price: 78},
		{name: "cola",price: 185},
		{name: "cola",price: 185},
		{name: "gaga",price: 78},
		{name: "spaghetti",price: 100},
		{name: "Macaron",price: 85}
	];

	var nameArr = [],nameUniqArr = [],result = [];

	_.each( test , function( prodObj ){
		nameArr.push(prodObj.name);
	} );

	nameUniqArr = _.uniq(nameArr);

	_.each( nameUniqArr , function( uniqName ){
		var count = prodCount(uniqName);
		var price = findPrice(uniqName);

		result.push( { name:uniqName , count:count , price:price } );
	} );

	console.log(result);

	function prodCount( prodName ){
		var count = 0;
		for (var i = 0; i < nameArr.length; i++) {
			if(nameArr[i] == prodName){
				count ++;
			}
		};

		return count;
	}

	function findPrice( prodName ){
		var result = _.find(test, function(prod){ return prod.name == prodName; });
		return result.price;
	}*/



})();