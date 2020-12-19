import { GraphQLServer } from 'graphql-yoga'

// Type Defintion Schema
const typeDefs = `
    type Query {
        hello: String!
        student(name: String,course:String): [Student!]!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        post: [Post!]!
        me: User!
    }

    type User{
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }

    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }

    type Student {
        name: String
        course: String
    }


`;

// Demo user data
// In posts author is the foreign key and id in users is the primary key
const users = [{
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27
}, {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com'
}, {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com'
}]

const posts = [{
    id: '10',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true,
    author: '1'
}, {
    id: '11',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: false,
    author: '1'
}, {
    id: '12',
    title: 'Programming Music',
    body: '',
    published: false,
    author: '2'
}]


const studentData = [{
    name: "Pavan",
    course: "Computer Science"
},{
    name: "Sonita",
    course: "Computer System"
},{
    name: "Bottle",
    course: "Bottle Course"
},{
  name: "Sanjay",
  course: "Computer Science"
},{
  name: "Virat",
  course: "Computer System"
}];

// Resolvers
const resolvers = {
    Query: {
        hello(){
            return 'This is my first Query';
        },

        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }

            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
            })
        },
        me() {
            return {
                id: '123098',
                name: 'Mike',
                email: 'mike@example.com'
            }
        },
        post() {
            return {
                id: '092',
                title: 'GraphQL 101',
                body: '',
                published: false
            }
        },

        student(parent,args,ctx,info){
            console.log(JSON.stringify(args));
            if (args.name != null || args.course != null) {
                var requestedParam = null;
                if(args.name != null){
                    requestedParam = "name";
                }else{
                    requestedParam = "course";
                }
                // var res = [];

                // for(let i = 0; i < studentData.length; i++){
                //     let currentStudentParam = (studentData[i])[requestedParam].toUpperCase().valueOf();
                //     let requestedStudentParam = args[requestedParam].toUpperCase().valueOf();
                  
                //     if(currentStudentParam === requestedStudentParam){
                //         res.push(studentData[i]);
                //     }
                // }

                return studentData.filter((student)=>{
                    return student[requestedParam].toUpperCase().valueOf() === args[requestedParam].toUpperCase().valueOf();
                });

                // return res;
              }
            return studentData;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        }
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=>{
    console.log("The server is up");
});