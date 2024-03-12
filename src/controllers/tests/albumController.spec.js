const { insertAlbumData, findAllAlbums } = require('../albumController');
const db = require('../../models/model');
const { isAdmin } = require('../../middlewares/authorizationMiddleware');
const Album = db.album;





jest.mock('../../middlewares/authorizationMiddleware.js', () => ({
    isAdmin: jest.fn(),

}));


describe('insertAlbumData function', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {},
            body: {
                name: 'Test Album',
                artist_id: 'artist_id',
                image_url: 'test_image_url',
            },
        };
        res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        next = jest.fn();
        mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        jest.clearAllMocks();

    });

    it('should return 403 if token is not present', async () => {
        await insertAlbumData(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ message: 'Invalid token!' });
    });


    it('should return 403 if user is not authorized', async () => {
        req.headers.authorization = 'valid_token';
        isAdmin.mockResolvedValue(false);
        await insertAlbumData(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ message: 'Not authorized!' });
    });


    it('should return 403 if token is expired', async () => {
        req.headers.authorization = 'valid_token';
        isAdmin.mockResolvedValue('expired');
        await insertAlbumData(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ message: 'Token expired!' });
    });

    it('should create a new album and return 201 status', async () => {
        req.headers.authorization = 'valid_token';
        isAdmin.mockResolvedValue(true);
        const createdAlbum = { _id: 'album_id', name: 'Test Album', artist_id: 'artist_id', image_url: 'test_image_url' };
        Album.create = jest.fn().mockResolvedValue(createdAlbum);
        await insertAlbumData(req, res);
        expect(Album.create).toHaveBeenCalledWith({
            album_id: expect.any(String),
            name: 'Test Album',
            artist_id: 'artist_id',
            image_url: 'test_image_url'
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(createdAlbum);
    });

    it('should handle errors properly', async () => {
        req.headers.authorization = 'valid_token';
        isAdmin.mockRejectedValue(new Error('Some error occurred'));
        await insertAlbumData(req, res);
        expect(mockConsoleError).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({ message: 'Error when creating a new album!' });
    });












});

describe('findAllAlbums', () => {

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });


    it('should return all albums when albums are found', async () => {
        const mockAlbums = [{ album_id: 1, name: 'Album 1' }, { album_id: 2, name: 'Album 2' }];
        db.album.findAll = jest.fn().mockResolvedValue(mockAlbums);

        await findAllAlbums(req, res);

        expect(Album.findAll).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(mockAlbums);
    });


    it('should return 404 if no albums are found', async () => {
        db.album.findAll = jest.fn().mockResolvedValue([]);

        await findAllAlbums(req, res);

        expect(Album.findAll).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({ "message": "No albums found!" });
    });

    it('should handle errors properly', async () => {
        const errorMessage = 'Internal Server Error';
        db.album.findAll = jest.fn().mockRejectedValue(new Error(errorMessage));

        await findAllAlbums(req,res);
         expect(Album.findAll).toHaveBeenCalledTimes(1);
         expect(console.error).toHaveBeenCalledWith(`Error listing all albums:`, errorMessage);
         expect(res.status).toHaveBeenCalledWith(500);
         expect(res.send).toHaveBeenCalledWith({"message":"Error when listing all albums!"});


    });
});






