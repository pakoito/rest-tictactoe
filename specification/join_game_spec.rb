require './specification/spec_helper.rb'

describe "join game" do
  include Helper

  before(:each) do
    @player1 = HttpClient.new
    @player1.set_host "localhost:3000"

    @player2 = HttpClient.new
    @player2.set_host "localhost:3000"

    @player1.post "/reset"
  end

  it "works", :focus => true do
    register_user @player1, "bobby", "password"
    register_user @player2, "timmy", "password"

    create_game @player1

    puts open_games(@player2)["games"]

    @player2.post open_games(@player2)["games"][0]["join"]["url"]

    expect(open_games(@player2)["games"].count).to eq(0)
  end
end
