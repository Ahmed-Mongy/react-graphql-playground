import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { FEED_QUERY } from './LinkList'


const POST_MUTATION = gql`
    mutation postMutation($url:String!, $description:String!){
        post(url:$url,description:$description){
            id,
            url,
            createdAt,
            description
        }
    }
`

class CreateLink extends Component {
    state = {
        description: '',
        url: '',
    }

    render() {
        const { description, url } = this.state
        return (
            <div>
                <div className="flex flex-column mt3">
                    <input
                        className="mb2"
                        value={description}
                        onChange={e => this.setState({ description: e.target.value })}
                        type="text"
                        placeholder="A description for the link"
                    />
                    <input
                        className="mb2"
                        value={url}
                        onChange={e => this.setState({ url: e.target.value })}
                        type="text"
                        placeholder="The URL for the link"
                    />
                </div>
                <Mutation 
                    mutation={POST_MUTATION}
                    onCompleted={ ()=> this.props.history.push("/")}
                    variables={{ url, description }}
                    update={(store, { data: { post } }) => {
                        const data = store.readQuery({ query: FEED_QUERY })
                        data.feed.links.unshift(post)
                        store.writeQuery({
                          query: FEED_QUERY,
                          data
                        })
                      }}
                    >
                    {
                        (
                            postMutation,
                            { data, loading, error }) => <button onClick={postMutation}>Submit</button>
                    }
                </Mutation>
            </div>
        )
    }
}

export default CreateLink