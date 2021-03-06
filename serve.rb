require 'sinatra'
require 'json'
require 'haml'
require 'sinatra/content_for'


require './config'
require './nuve'


set :bind, '0.0.0.0'
set :haml, :format => :html5, :attr_wrapper => '"'
set :public_folder, 'public'

# Initializing Nuve API
nuve = Nuve.new $config[:service], $config[:key], $config[:url]

# Getting a room
rooms_json = nuve.getRooms()

rooms = JSON.parse(rooms_json)
room = rooms.find { |item| item['name'] == $config[:new_room_name] }

if room.nil?
    room_json = nuve.createRoom($config[:new_room_name])
    room = JSON.parse(room_json)
end

get '/' do
    haml :index
end

get '/initiator' do
    @token = nuve.createToken(room['_id'], 'initiator', 'initiator')
    haml :initiator
end

get '/participant' do
    haml :participant
end

get '/example' do
    haml :example
end

post '/_tokens' do
    content_type :json
    status 201
    token = nuve.createToken(room['_id'], params[:user], 'participant')
    { :token => token }.to_json
end
