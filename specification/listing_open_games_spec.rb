require './specification/spec_helper.rb'

describe "listing open games" do
  before(:each) do
    @player1 = HttpClient.new
    @player1.set_host "localhost:3000"

    @player2 = HttpClient.new
    @player2.set_host "localhost:3000"

    @player1.post "/reset"

    register_user @player1, "player1", "password"
    register_user @player2, "player2", "password"
  end

  specify "other players can see open games", :focus => true do
    expect(open_games(@player2).length).to eq(0)
    create_game @player1
    expect(open_games(@player2).length).to eq(1)
  end

  specify "player cannot see his own game", :focus => true do
    create_game @player1
    expect(open_games(@player1).length).to eq(0)
  end

  specify "unauthenticated players cannot see open games", :focus => true do
    client = HttpClient.new
    client.set_host "localhost:3000"
    expect(root(client)["opengames"]).to eq(nil)
  end

  specify "unauthenticated players are denied access to open games", :focus => true do
    client = HttpClient.new
    client.set_host "localhost:3000"
    results = client.get("/opengames")
    expect(results["error"]).to eq("you need to register and pass in an authentication header to see this resource")
    expect(results["root"]).not_to eq(nil)
    expect(results["register"]).not_to eq(nil)
  end

  def register_user client, username, password
    client.authorization = client.get(
      root(client)["encode"]["url"]
        .gsub(":username", username)
        .gsub(":password", password))["result"]

    client.post "/register"
  end

  def create_game client
    client.post root(client)["newgame"]["url"]
  end

  def open_games client
    client.get(root(@player2)["opengames"]["url"])["games"]
  end

  def root client
    client.get "/"
  end
end
