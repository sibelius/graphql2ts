const Query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    checkinSearchQuery: {
      type: CheckinSearchResult,
      args: {
        query: {
          type: CheckinSearchInput
        }
      }
    },
    defaultSettings: {
      type: Settings
    },
    route: {
      type: Route,
      args: {
        waypoints: {
          type: GraphQLNonNull(GraphQLList(GraphQLNonNull(WayPoint)))
        }
      }
    },
    items: {
      type: ItemFilterResult,
      args: {
        filter: {
          type: ItemFilterInput
        }
      }
    },
    maybeNode: {
      type: MaybeNode
    },
    neverNode: {
      type: NeverNode
    },
    named: {
      type: Named
    },
    me: {
      type: User
    },
    node: {
      type: Node,
      args: {
        id: {
          type: ID
        }
      }
    },
    node_id_required: {
      type: Node,
      args: {
        id: {
          type: GraphQLNonNull(ID)
        }
      }
    },
    nodes: {
      type: GraphQLList(Node),
      args: {
        ids: {
          type: GraphQLList(GraphQLNonNull(ID))
        }
      }
    },
    settings: {
      type: Settings,
      args: {
        environment: {
          type: Environment
        }
      }
    },
    story: {
      type: Story
    },
    task: {
      type: Task,
      args: {
        number: {
          type: Int
        }
      }
    },
    username: {
      type: Actor,
      args: {
        name: {
          type: GraphQLNonNull(String)
        }
      }
    },
    usernames: {
      type: GraphQLList(Actor),
      args: {
        names: {
          type: GraphQLNonNull(GraphQLList(GraphQLNonNull(String)))
        }
      }
    },
    viewer: {
      type: Viewer
    },
    _mutation: {
      type: Mutation
    }
  })
});
