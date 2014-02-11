require './specification/spec_helper.rb'

describe "listing open games" do
  include Helper

  before(:each) do
    @player1 = HttpClient.new
    @player1.set_host "localhost:3000"

    @player2 = HttpClient.new
    @player2.set_host "localhost:3000"

    @player1.post "/reset"

    register_user @player1, "player1", "password"
    register_user @player2, "player2", "password"
  end

  specify "other players can see open games" do
    expect(open_games(@player2)["games"].length).to eq(0)
    create_game @player1
    expect(open_games(@player2)["games"].length).to eq(1)
  end

  specify "player cannot see his own game" do
    create_game @player1
    expect(open_games(@player1)["games"].length).to eq(0)
  end

  specify "unregistered players cannot see open games" do
    client = HttpClient.new
    client.set_host "localhost:3000"
    client.authorization = encode(client, "noone", "password")
    expect(root(client)["opengames"]).to eq(nil)
  end

  specify "unauthenticated players are denied access to open games" do
    client = HttpClient.new
    client.set_host "localhost:3000"
    results = client.get("/opengames")
    expect(results["error"]).to eq("you need to register and pass in an authentication header to see this resource")
    expect(results["root"]).not_to eq(nil)
    expect(results["register"]).not_to eq(nil)
  end
end
