const blogSearchQuery = ({guide, title, excerpt, catagories, placesFeatured, tags}) => {
    const query = {}

    if (guide) {
        query.guide = guide
    }

    if (title) {
        query.title = {$regex: title, $options: 'i'}
    }

    if (excerpt) {
        query.excerpt = {$regex: excerpt, $options: 'i'}
    }

    if (catagories) {
        query.catagories = {$in: catagories}
    }

    if (placesFeatured) {
        query.placesFeatured = {$in: placesFeatured}
    }
 
    if (catagories) {
        query.tags = {$in: tags}
    }

    return query
}

const guideSearchQuery = ({places, tourTypes}) => {
    const query = {
        places: [],
        tourTypes: []
    }
    console.log(places)
    console.log(tourTypes)
    if(places) {
        places = JSON.parse(places)
        
    }

    if(tourTypes) {
        tourTypes = JSON.parse(tourTypes)
        tourTypes.forEach(type => query.tourTypes.push(type))
    }

    return query 
}
 
module.exports = {
    blogSearchQuery,
    guideSearchQuery,
}