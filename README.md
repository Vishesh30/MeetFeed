# MeetFeed
An Application to Capture Meeting Feed

# Steps to Run
1. Make sure MongoDB is installed locally and running:- mongodb://localhost:27017/meanApp. ( meanApp is name of the DB )
2. Clone the repo
3. npm install
4. npm start

The API will be accessible at:-
http://localhost:3000/api/post


## UI
The UI is accessible via http://localhost:3000

## API List
- 2 new APIs are added to upvote and down vote. This will be required for UI.
POST Request: http://localhost:3000/api/post/{postId}/upVote