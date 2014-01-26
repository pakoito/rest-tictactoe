require './specification/spec_helper.rb'

describe "new game" do
  before(:each) do
    @client = HttpClient.new
    @client.set_host "localhost:3000"
    @client.post "/reset"
  end

  specify "option to create game is only available if user authenticates" do
    expect(root["newgame"]).to eq(nil)

    register_user "bobby", "password"

    expect(root["newgame"]).not_to eq(nil)
  end

  def register_user username, password
    auth = @client.get(
      root["encode"]["url"]
        .gsub(":username", username)
        .gsub(":password", password))["result"]

    @client.authorization = auth

    @client.post "/register"
  end

  def root
    @client.get "/"
  end
end
