CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	user_name TEXT, 
	user_password TEXT, 
	user_email TEXT 
)

--copy and paste to query in pgAdmin

  <%if(locals.posts){%> 
    
    <%posts.forEach(post => {%>
      <div class="container mt-3">
        <h2><%=post.post_title%></h2>
        <p><%=post.posts%></p>
        <p class="text-secondary"><%=post.date%></p>
      </div>
      <%})%>
  <%}%>

  <div class="container">
        <h1>Welcome, <%=data.user_name %></h1>
    </div>