function asynChronousOPeration(){};
		asynChronousOPeration.prototype.asynArr = [];
		asynChronousOPeration.prototype.executionList = function(value){//It store in the order in which it needs to executed
			if(this.asynArr.length == 0){ 
				this.asynArr.push(value);
				this.executionOrder()
			} else {
				this.asynArr.push(value);
			}			
		};
		asynChronousOPeration.prototype.executionOrder = function(){//this executes the first element in the array
			var reference = this.asynArr[0];
			reference && reference.transactionSwitch();
		};
		asynChronousOPeration.prototype.executionComplete = function(){// deletes the first element in the execution order
			this.asynArr = Array.prototype.splice.call(this.asynArr, 1);
			this.executionOrder();
		};