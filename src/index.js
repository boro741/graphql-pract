import { GraphQLServer } from 'graphql-yoga'

// Type Defintion Schema
const typeDefs = `
    type Query {
        hello: String!,
        student(name: String,course:String): [Student!]!
    }

    type Student {
        name: String,
        course: String
    }
`;

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

        student(parent,args,ctx,info){
            console.log(JSON.stringify(args));
            if (args.name != null || args.course != null) {
                var requestedParam = null;
                if(args.name != null){
                    requestedParam = "name";
                }else{
                    requestedParam = "course";
                }
                var res = [];

                for(let i = 0; i < studentData.length; i++){
                    let currentStudentParam = (studentData[i])[requestedParam].toUpperCase().valueOf();
                    let requestedStudentParam = args[requestedParam].toUpperCase().valueOf();
                  
                    if(currentStudentParam === requestedStudentParam){
                        res.push(studentData[i]);
                    }
                }

                return res;
              }
            return studentData;
        },

    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=>{
    console.log("The server is up");
});