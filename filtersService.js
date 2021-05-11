class FiltersService {

    constructor() {
        this.getFirstResult = (result) => { return result[0] }
    }
    getFiltersPredicate(filters) {
        let predicate

        if (filters.length > 0) {
            const filterCategories = (result) => result.filter(element => {
                const elCategories = element.categories.split(",")
                const filterCategories = filters.split(",")
                return elCategories.some(c => { return filterCategories.indexOf(c) !== -1 })
            })
            predicate = (result) => { return filterCategories(this.getFirstResult(result)) }
        } else { predicate = this.getFirstResult }

        return predicate
    }
}

module.exports = FiltersService