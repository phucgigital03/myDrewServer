const mongooseToObj = {
    mutipleObj(arrObj){
        return arrObj.map((obj)=> obj.toObject())
    },
    oneObj(obj){
        return typeof obj === 'object' ? obj.toObject() : obj;
    }
}

module.exports = mongooseToObj