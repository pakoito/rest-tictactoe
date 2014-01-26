require './specification/spec_helper.rb'

describe "registering" do
  include Helper

  before(:each) do
    @client = HttpClient.new
    @client.set_host "localhost:3000"
    @client.post "/reset"
  end

  specify "new user" do
    result = register_user @client, "username", "password"
    expect(result["username"]).to eq("username")
    expect(result["password"]).to eq("password")
  end

  specify "existing user" do
    register_user @client, "username", "password"
    result = register_user @client, "username", "password"
    expect(result["error"]).to eq("username unavailable")
  end
end
