using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class Add //550
    {
        public class Command : IRequest<Photo>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, Photo>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;


            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;

                _context = context;
            }

            public async Task<Photo> Handle(Command request, CancellationToken cancellationToken)
            {
                // Current user
                var observer = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                // The follower
                var target = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if(target == null){
                    throw new RestException(HttpStatusCode.NotFound, new {User, "Not Found"});
                }

                var following = await _context.Followings.SingleOrDEfault(
                        x => x.observer.Id == observer.Id 
                        &&   x.target.Id == target.Id);
                
                if(following != null)
                throw new RestException(HttpStatusCode.BadRequest, new {User, "You are already following this user"});

                if(following == null){
                    following = new UserFollowing{
                        Observer = observer,
                        Target = target
                    };

                    _context.Followings.Add(following);
                }

                var success = await _context.SaveChangesAsync() > 0;

                if(success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}