require 'pry'
require 'sinatra'
require 'json'
require 'haml'
require 'sinatra/content_for'


require './config'
require './nuve'

set :haml, :attr_wrapper => '"'
set :public_folder, 'public'

# Initializing Nuve API
nuve = Nuve.new $config[:service], $config[:key], $config[:url]

# Getting a room
rooms_json = nuve.getRooms()
rooms = JSON.parse(rooms_json)
if rooms.empty?
    room_json = nuve.createRoom($config[:new_room_name])
    room = JSON.parse(room_json)
else
    room = rooms[0]
end

get '/' do
    haml :index
end

get '/initiator' do
    haml :initiator
end

get '/participant' do
    haml :participant
end

post '/_tokens' do
    content_type :json
    status 201
    token = nuve.createToken(room['_id'], params[:user], '')
    { :token => token }.to_json
end
