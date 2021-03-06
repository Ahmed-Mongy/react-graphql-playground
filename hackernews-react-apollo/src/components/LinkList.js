import React, { Component } from 'react'
import Link from './Link'
import { Query } from 'react-apollo';
import gql from 'graphql-tag';


export const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`
class LinkList extends Component {


  _updateCacheAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({ query: FEED_QUERY })
  
    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
  
    store.writeQuery({ query: FEED_QUERY, data })
  }
  render() {
    return (
      <Query query={FEED_QUERY} >
        {({ error, loading, data }) => {
          if (loading) return <h3>LOADING...</h3>;
          if (error) return <h1>ERROR</h1>;
          const linksToRender = data.feed.links;

          return (
            <div>
              {linksToRender.map((link, index) => (
                <Link 
                  key={link.id} 
                  link={link} 
                  updateStoreAfterVote={this._updateCacheAfterVote}
                  index={index} />
              ))}
            </div>
          )

        }

        }
      </Query>
    )
  }
}

export default LinkList