require './specification/spec_helper.rb'

describe "making a move in tic tac toe" do
  before(:each) do
    @player1 = HttpClient.new
    @player1.set_host "localhost:3000"

    @player2 = HttpClient.new
    @player2.set_host "localhost:3000"

    @player1.post "/reset"
  end

  specify "player one makes a move" do
    register_user @player1, "player1", "password"
    register_user @player2, "player1", "password"

    @player1.post root(@player1)["newgame"]["url"]

    @player1.post root(@player2)["opengames"].first["join"]
  end

  def register_user client, username, password
    client.authorization = client.get(
      root(client)["encode"]["url"]
        .gsub(":username", username)
        .gsub(":password", password))["result"]

    client.post "/register"
  end

  def root client
    client.get "/"
  end
end
