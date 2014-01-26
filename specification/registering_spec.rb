require './specification/spec_helper.rb'

describe "registering" do
  before(:each) do
    @client = HttpClient.new
    @client.set_host "localhost:3000"
    @client.post "/reset"
  end

  specify "new user" do
    result = register_user "username", "password"
    expect(result["username"]).to eq("username")
    expect(result["password"]).to eq("password")
  end

  specify "existing user" do
    register_user "username", "password"
    result = register_user "username", "password"
    expect(result["error"]).to eq("username unavailable")
  end

  def register_user username, password
    auth = @client.get(root["encode"]["url"], {
      :username => username,
      :password => password
    })["result"]

    @client.authorization = auth

    @client.post "/register"
  end

  def root
    @client.get "/"
  end

  def print json
    if json["error"]
      puts json ["error"]
    else
      puts JSON.pretty_generate(json)
    end
  end
end
