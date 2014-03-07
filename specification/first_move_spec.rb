require './specification/spec_helper.rb'

describe "making a move in tic tac toe" do
  include Helper

  before(:each) do
    @player1 = HttpClient.new
    @player1.set_host "localhost:3000"

    @player2 = HttpClient.new
    @player2.set_host "localhost:3000"

    @player1.post "/reset"
  end

  specify "it works", :focus => true do
    register_user @player1, "bobby", "password"
    register_user @player2, "timmy", "password"

    create_game @player1

    print inprogress_games(@player1)

    join_game @player2, open_games(@player2)["games"].first

    print inprogress_games(@player1)

    expect(first_inprogress_game(@player1)["turn"]["topleft"]).not_to eq(nil)
  end

  def first_inprogress_game(player) 
    inprogress_games(player)["games"][0]
  end
end
